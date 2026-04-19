const prisma = require('../prisma/client');

const getAllEscalations = async (req, res) => {
  try {
    const escalations = await prisma.escalation.findMany({
      orderBy: {
        created_at: 'desc',
      },
    });
    res.json({ success: true, data: escalations });
  } catch (error) {
    console.error('Error fetching escalations:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch escalations' });
  }
};

const createEscalation = async (req, res) => {
  const { ticket_id, client_name, severity, assigned_agent, supervisor_notes } = req.body;

  if (!ticket_id || !client_name || !severity || !assigned_agent) {
    return res.status(400).json({ success: false, error: 'Missing required fields' });
  }

  try {
    const newEscalation = await prisma.escalation.create({
      data: {
        ticket_id,
        client_name,
        severity,
        assigned_agent,
        supervisor_notes,
      },
    });
    res.status(201).json({ success: true, data: newEscalation });
  } catch (error) {
    console.error('Error creating escalation:', error);
    res.status(500).json({ success: false, error: 'Failed to create escalation' });
  }
};

const updateEscalation = async (req, res) => {
  const { id } = req.params;
  const { ticket_id, client_name, severity, status, assigned_agent, supervisor_notes } = req.body;

  try {
    const updatedEscalation = await prisma.escalation.update({
      where: { id: parseInt(id) },
      data: {
        ticket_id,
        client_name,
        severity,
        status,
        assigned_agent,
        supervisor_notes,
      },
    });
    res.json({ success: true, data: updatedEscalation });
  } catch (error) {
    if (error.code === 'P2025') {
      return res.status(404).json({ success: false, error: 'Escalation not found' });
    }
    console.error('Error updating escalation:', error);
    res.status(500).json({ success: false, error: 'Failed to update escalation' });
  }
};

const deleteEscalation = async (req, res) => {
  const { id } = req.params;

  try {
    await prisma.escalation.delete({
      where: { id: parseInt(id) },
    });
    res.json({ success: true, message: 'Escalation deleted successfully' });
  } catch (error) {
    if (error.code === 'P2025') {
      return res.status(404).json({ success: false, error: 'Escalation not found' });
    }
    console.error('Error deleting escalation:', error);
    res.status(500).json({ success: false, error: 'Failed to delete escalation' });
  }
};

module.exports = {
  getAllEscalations,
  createEscalation,
  updateEscalation,
  deleteEscalation,
};
