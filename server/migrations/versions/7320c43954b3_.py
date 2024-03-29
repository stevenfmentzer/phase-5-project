"""empty message

Revision ID: 7320c43954b3
Revises: a9200fa21bdb
Create Date: 2024-02-28 11:32:02.784022

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '7320c43954b3'
down_revision = 'a9200fa21bdb'
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    with op.batch_alter_table('inboxes', schema=None) as batch_op:
        batch_op.create_foreign_key(batch_op.f('fk_inboxes_first_message_id_messages'), 'messages', ['first_message_id'], ['id'])
        batch_op.create_foreign_key(batch_op.f('fk_inboxes_last_message_id_messages'), 'messages', ['last_message_id'], ['id'])

    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    with op.batch_alter_table('inboxes', schema=None) as batch_op:
        batch_op.drop_constraint(batch_op.f('fk_inboxes_last_message_id_messages'), type_='foreignkey')
        batch_op.drop_constraint(batch_op.f('fk_inboxes_first_message_id_messages'), type_='foreignkey')

    # ### end Alembic commands ###
