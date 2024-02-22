"""Initial migration

Revision ID: 8f3544c05a66
Revises: 
Create Date: 2024-02-21 23:38:57.581720

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '8f3544c05a66'
down_revision = None
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.create_table('inboxes',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('user_id', sa.Integer(), nullable=True),
    sa.Column('contact_user_id', sa.Integer(), nullable=True),
    sa.Column('last_message_id', sa.Integer(), nullable=True),
    sa.PrimaryKeyConstraint('id', name=op.f('pk_inboxes'))
    )
    op.create_table('users',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('first_name', sa.VARCHAR(length=20), nullable=False),
    sa.Column('last_name', sa.VARCHAR(length=20), nullable=False),
    sa.Column('phone_number', sa.VARCHAR(length=20), nullable=False),
    sa.Column('email', sa.VARCHAR(length=320), nullable=False),
    sa.Column('join_date', sa.DateTime(), nullable=True),
    sa.Column('available_status', sa.Boolean(), nullable=True),
    sa.Column('_password_hash', sa.VARCHAR(), nullable=True),
    sa.PrimaryKeyConstraint('id', name=op.f('pk_users')),
    sa.UniqueConstraint('email', name=op.f('uq_users_email')),
    sa.UniqueConstraint('phone_number', name=op.f('uq_users_phone_number'))
    )
    op.create_table('friendships',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('user1_id', sa.Integer(), nullable=True),
    sa.Column('user2_id', sa.Integer(), nullable=True),
    sa.Column('is_active', sa.Boolean(), nullable=True),
    sa.Column('is_close_friend', sa.Boolean(), nullable=True),
    sa.Column('creation_date', sa.DateTime(), nullable=True),
    sa.Column('message_count', sa.Integer(), nullable=True),
    sa.ForeignKeyConstraint(['user1_id'], ['users.id'], name=op.f('fk_friendships_user1_id_users')),
    sa.ForeignKeyConstraint(['user2_id'], ['users.id'], name=op.f('fk_friendships_user2_id_users')),
    sa.PrimaryKeyConstraint('id', name=op.f('pk_friendships'))
    )
    op.create_table('messages',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('parent_message_id', sa.Integer(), nullable=True),
    sa.Column('sender_id', sa.Integer(), nullable=True),
    sa.Column('recipient_id', sa.Integer(), nullable=True),
    sa.Column('sent_time', sa.DateTime(), nullable=True),
    sa.Column('delivery_time', sa.DateTime(), nullable=True),
    sa.Column('message_body', sa.VARCHAR(length=400), nullable=True),
    sa.Column('is_read', sa.Boolean(), nullable=True),
    sa.ForeignKeyConstraint(['parent_message_id'], ['messages.id'], name=op.f('fk_messages_parent_message_id_messages')),
    sa.ForeignKeyConstraint(['recipient_id'], ['users.id'], name=op.f('fk_messages_recipient_id_users')),
    sa.ForeignKeyConstraint(['sender_id'], ['users.id'], name=op.f('fk_messages_sender_id_users')),
    sa.PrimaryKeyConstraint('id', name=op.f('pk_messages'))
    )
    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_table('messages')
    op.drop_table('friendships')
    op.drop_table('users')
    op.drop_table('inboxes')
    # ### end Alembic commands ###