"""Inbox/Message Relationship

Revision ID: 44b0165807ab
Revises: b0900bf0ad7b
Create Date: 2024-02-22 12:37:50.251126

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '44b0165807ab'
down_revision = 'b0900bf0ad7b'
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    with op.batch_alter_table('inboxes', schema=None) as batch_op:
        batch_op.add_column(sa.Column('first_message_id', sa.Integer(), nullable=True))

    with op.batch_alter_table('messages', schema=None) as batch_op:
        batch_op.add_column(sa.Column('creation_time', sa.DateTime(), nullable=True))
        batch_op.drop_column('sent_time')

    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    with op.batch_alter_table('messages', schema=None) as batch_op:
        batch_op.add_column(sa.Column('sent_time', sa.DATETIME(), nullable=True))
        batch_op.drop_column('creation_time')

    with op.batch_alter_table('inboxes', schema=None) as batch_op:
        batch_op.drop_column('first_message_id')

    # ### end Alembic commands ###
