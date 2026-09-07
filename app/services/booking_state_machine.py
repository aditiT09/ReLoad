"""
This state machine is the single source of truth for valid booking status transitions. 
Note that 'closed' and 'cancelled' have no further valid transitions (empty/absent from 
VALID_TRANSITIONS) — they are terminal states. This enforcement matters because handoff-
proof confirmation, payment release, and safety-flag logic all depend on a booking only 
ever being in a state reachable through this exact sequence — skipping a step would 
silently break the trust guarantees the whole platform depends on.
"""

# app/services/booking_state_machine.py

VALID_TRANSITIONS = {
    "requested": ["accepted", "cancelled"],
    "accepted": ["pickup_confirmed", "cancelled"],
    "pickup_confirmed": ["in_transit", "cancelled"],
    "in_transit": ["delivered"],
    "delivered": ["closed"],
}


def can_transition(current_status: str, new_status: str) -> bool:
    """
    Checks whether a booking can move from current_status to new_status per 
    VALID_TRANSITIONS. Returns True/False only — raises no exceptions. The calling 
    router is responsible for returning an appropriate HTTP error (e.g. 400) if this 
    returns False.
    """
    return new_status in VALID_TRANSITIONS.get(current_status, [])