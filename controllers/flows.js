const Flow = require('../models/flows');

exports.saveFlow = async (req, res) => {
  const { _id:userId } = req.user; 
  const {flowId,name,description,nodes,edges,metadata,triggers} = req.body;

  try {
    let flow;

    if (flowId) {
      flow = await Flow.findOneAndUpdate(
        { _id: flowId, userId },
        {
          name,
          description,
          nodes,
          edges,
          metadata,
          triggers,
          updatedAt: new Date()
        },
        { new: true }
      );
      if (!flow) return res.status(404).json({ success: false, message: 'Flow not found' });
    } else {
      flow = await Flow.create({
        userId,
        name,
        description,
        nodes,
        edges,
        metadata,
        triggers
      });
    }

    res.status(200).json({ success: true, flow });
  } catch (err) {
    console.error('Save Flow Error:', err);
    res.status(500).json({ success: false, message: 'Server error saving flow' });
  }
};


exports.getFlows = async (req, res) => {
  const { userId } = req.user;

  try {
    const flows = await Flow.find({ userId }).sort({ updatedAt: -1 });
    res.status(200).json({ success: true, flows });
  } catch (err) {
    console.error('Get Flows Error:', err);
    res.status(500).json({ success: false, message: 'Error fetching flows' });
  }
};


exports.getFlowById = async (req, res) => {
  const { userId } = req.user;
  const { id } = req.params;

  try {
    const flow = await Flow.findOne({ _id: id, userId });
    if (!flow) return res.status(404).json({ success: false, message: 'Flow not found' });

    res.status(200).json({ success: true, flow });
  } catch (err) {
    console.error('Get Flow By ID Error:', err);
    res.status(500).json({ success: false, message: 'Error fetching flow' });
  }
};


exports.deleteFlow = async (req, res) => {
  const { userId } = req.user;
  const { id } = req.params;

  try {
    const deleted = await Flow.findOneAndDelete({ _id: id, userId });
    if (!deleted) return res.status(404).json({ success: false, message: 'Flow not found' });

    res.status(200).json({ success: true, message: 'Flow deleted' });
  } catch (err) {
    console.error('Delete Flow Error:', err);
    res.status(500).json({ success: false, message: 'Error deleting flow' });
  }
};
