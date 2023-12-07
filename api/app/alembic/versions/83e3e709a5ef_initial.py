"""initial

Revision ID: 83e3e709a5ef
Revises: 
Create Date: 2023-12-06 10:48:29.455673

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '83e3e709a5ef'
down_revision: Union[str, None] = None
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.create_table(
        'users',
        sa.Column('id', sa.Integer, primary_key=True),
        sa.Column('username', sa.String, unique=True),
        sa.Column('email', sa.String, unique=True),
        sa.Column('password', sa.String),
    )

    op.create_table(
        'stories',
        sa.Column('id', sa.Integer, primary_key=True),
        sa.Column('title', sa.String),
        sa.Column('description', sa.String),
        sa.Column('category', sa.String),
        sa.Column('content', sa.String),
    )


def downgrade() -> None:
    op.drop_table('users')
