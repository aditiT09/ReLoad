# app/seed.py

import random
import string
import uuid
from datetime import datetime, timedelta, timezone

from app.core.database import SessionLocal
from app.core.security import hash_password
from app.models.user import User
from app.models.vehicle import Vehicle
from app.models.booking import Booking
from app.models.demand_log import DemandLog
from app.services.fare_service import calculate_fare


def run_seed() -> None:
    db = SessionLocal()
    try:
        print("Starting database seed...")
        
        # 1. Create Users (Customers)
        print("Seeding customers...")
        hashed_pw = hash_password("password123")
        customer_names = ["Amit Kumar", "Priya Sharma", "Rahul Verma", "Sneha Singh", "Rohan Gupta"]
        customers = []
        
        for name in customer_names:
            phone = f"+91{random.randint(6000000000, 9999999999)}"
            customer = User(role="customer", name=name, phone=phone, password_hash=hashed_pw)
            db.add(customer)
            customers.append(customer)
            
        # 2. Create Users (Drivers)
        print("Seeding drivers...")
        driver_names = [
            "Vikram Singh", "Sunil Das", "Rajesh Yadav", "Sanjay Mishra", "Anil Pandey",
    "       Ravi Tiwari", "Suresh Kumar", "Deepak Chopra", "Mohit Agarwal", "Arjun Malhotra",
            "Prakash Reddy", "Naveen Rao", "Vijay Kumar", "Ramesh Chandra", "Ashok Verma"
]
        drivers = []
        
        for name in driver_names:
            phone = f"+91{random.randint(6000000000, 9999999999)}"
            driver = User(role="driver", name=name, phone=phone, password_hash=hashed_pw)
            db.add(driver)
            drivers.append(driver)
            
        # Commit users so they get valid DB-generated UUIDs
        db.commit()
        
        # 3. Create Vehicles
        print("Seeding vehicles...")
        vehicle_types = ["bike", "tempo", "pickup_8ft", "pickup_14ft", "truck", "cold_chain_van"]
        vehicles = []
        verification_counts = {"verified": 0, "due": 0, "expired": 0}
        
        current_year = datetime.now().year
        now = datetime.now(timezone.utc)
        
        for i, driver in enumerate(drivers):
            v_type = vehicle_types[i % len(vehicle_types)]
            
            chars = "".join(random.choices(string.ascii_uppercase, k=4))
            reg_num = f"UP{random.randint(10, 99)}-{chars}-{random.randint(1000, 9999)}"
            
            # Age-cap demonstration: 
            # Deliberately create 3 vehicles with a registration year 7-8 years ago. 
            # While the API router would reject these (due to the 5-year cap check), 
            # injecting them directly via DB seed demonstrates how the system handles 
            # legacy/grandfathered vehicles.
            if i < 3:
                reg_year = current_year - random.randint(7, 8)
            else:
                reg_year = current_year - random.randint(1, 5)
                
            # Distribution: ~60% verified, ~20% due, ~20% expired
            rand_val = random.random()
            if rand_val < 0.6:
                status = "verified"
                days_ago = random.randint(1, 170) # Within last 6 months
            elif rand_val < 0.8:
                status = "due"
                days_ago = random.randint(180, 210) # 6-7 months ago
            else:
                status = "expired"
                days_ago = random.randint(240, 365) # 8+ months ago
                
            last_checked = now - timedelta(days=days_ago)
            
            vehicle = Vehicle(
                driver_id=driver.id,
                type=v_type,
                registration_number=reg_num,
                registration_year=reg_year,
                verification_status=status,
                last_checked_date=last_checked
            )
            db.add(vehicle)
            vehicles.append(vehicle)
            verification_counts[status] += 1
            
        db.commit()
        
        # 4. Create Bookings and Demand Logs
        print("Seeding bookings and demand logs...")
        
        # ZONE CLUSTERING LOGIC:
        # Instead of purely random coordinates across the city bounding box, we define 4 core 
        # economic hubs in Lucknow. Bookings are randomly assigned a hub, then given a slight 
        # random geographic jitter. This creates visible geographic density clusters that 
        # realistic ML demand-forecasting models depend on to learn hot-spots, rather than 
        # uniform noise.
        lucknow_clusters = [
            (26.8500, 80.9499), # Hazratganj (Central Hub)
            (26.8606, 80.9858), # Gomti Nagar (Commercial/IT)
            (26.8048, 80.9000), # Alambagh (Transport Hub)
            (26.8858, 80.9996), # Indira Nagar (Residential/Market)
        ]
        
        def get_jittered_coord(lat: float, lng: float) -> tuple[float, float]:
            # +/- 0.03 degrees is roughly a ~3km radius
            return lat + random.uniform(-0.03, 0.03), lng + random.uniform(-0.03, 0.03)
            
        def get_realistic_past_time() -> datetime:
            while True:
                days_ago = random.randint(0, 30)
                hour = random.randint(0, 23)
                minute = random.randint(0, 59)
                dt = now - timedelta(days=days_ago)
                dt = dt.replace(hour=hour, minute=minute, second=0, microsecond=0)
                
                # Bias towards weekdays: 40% chance to reroll if it's a weekend
                if dt.weekday() >= 5 and random.random() < 0.4:
                    continue
                    
                # Bias towards daytime: 70% chance to reroll if it's night (9 PM - 7 AM)
                if (hour < 7 or hour >= 21) and random.random() < 0.7:
                    continue
                    
                return dt
                
        cargo_categories = ["general", "pharma", "cold_chain", "dairy", "other"]
        non_closed_statuses = ["requested", "accepted", "pickup_confirmed", "in_transit", "delivered"]
        
        bookings_count = 0
        
        for _ in range(60):
            customer = random.choice(customers)
            vehicle = random.choice(vehicles)
            
            p_center = random.choice(lucknow_clusters)
            d_center = random.choice(lucknow_clusters)
            
            p_lat, p_lng = get_jittered_coord(*p_center)
            d_lat, d_lng = get_jittered_coord(*d_center)
            
            base_fare = calculate_fare(p_lat, p_lng, d_lat, d_lng, vehicle.type)
            created_at = get_realistic_past_time()
            
            if random.random() < 0.8:
                status = "closed"
                payment = "paid"
            else:
                status = random.choice(non_closed_statuses)
                payment = "pending"
                
            booking = Booking(
                customer_id=customer.id,
                driver_id=vehicle.driver_id,
                vehicle_id=vehicle.id,
                pickup_address=f"Landmark {random.randint(1, 99)}, Lucknow",
                pickup_lat=p_lat,
                pickup_lng=p_lng,
                dropoff_address=f"Landmark {random.randint(100, 199)}, Lucknow",
                dropoff_lat=d_lat,
                dropoff_lng=d_lng,
                cargo_category=random.choice(cargo_categories),
                status=status,
                base_fare=base_fare,
                payment_status=payment,
                created_at=created_at
            )
            
            db.add(booking)
            db.flush() # Flush to assign booking.id for the DemandLog
            
            # Per the frozen demand_logs contract: raw coordinates + timestamp only
            demand_log = DemandLog(
                booking_id=booking.id,
                pickup_lat=booking.pickup_lat,
                pickup_lng=booking.pickup_lng,
                booking_created_at=booking.created_at
            )
            db.add(demand_log)
            
            bookings_count += 1
            
        db.commit()
        
        # 5. Print Summary
        print("\n=== Seed Complete ===")
        print(f"Customers created: {len(customers)}")
        print(f"Drivers created:   {len(drivers)}")
        print(f"Vehicles created:  {len(vehicles)}")
        print(f"  - Verified: {verification_counts['verified']}")
        print(f"  - Due:      {verification_counts['due']}")
        print(f"  - Expired:  {verification_counts['expired']}")
        print(f"Bookings created:  {bookings_count}")
        print(f"Demand logs sync:  {bookings_count}")
        print("=====================\n")

    except Exception as e:
        db.rollback()
        print(f"An error occurred during seeding: {e}")
        raise
    finally:
        db.close()


if __name__ == "__main__":
    run_seed()