"""create payments table

Revision ID: 7c12f458ab9e
Revises: 00d155f5bb5e
Create Date: 2026-09-09 00:20:00.000000

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '7c12f458ab9e'
down_revision: Union[str, Sequence[str], None] = '00d155f5bb5e'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.create_table(
        'payments',
        sa.Column('id', sa.UUID(), nullable=False),
        sa.Column('booking_id', sa.UUID(), nullable=False),
        sa.Column('amount', sa.Numeric(precision=10, scale=2), nullable=False),
        sa.Column('status', sa.Enum('pending', 'held', 'released', 'disputed', 'refunded', name='payment_record_status_enum'), nullable=False),
        sa.Column('gateway', sa.String(), nullable=False),
        sa.Column('gateway_payment_id', sa.String(), nullable=True),
        sa.Column('created_at', sa.DateTime(timezone=True), nullable=False),
        sa.Column('updated_at', sa.DateTime(timezone=True), nullable=False),
        sa.ForeignKeyConstraint(['booking_id'], ['bookings.id'], ),
        sa.PrimaryKeyConstraint('id'),
        sa.UniqueConstraint('booking_id')
    )


def downgrade() -> None:
    op.drop_table('payments')
    op.execute("DROP TYPE IF EXISTS payment_record_status_enum")
