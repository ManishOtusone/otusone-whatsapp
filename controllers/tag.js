const Tag = require('../models/tags');

function generateDisplayColor(tagName) {
    const hash = [...tagName].reduce((acc, char) => acc + char.charCodeAt(0), 0);
    const colors = [
        { main: '#cc3d00', light: '#f3f0c5' },
        { main: '#007bff', light: '#d6e4ff' },
        { main: '#28a745', light: '#d4edda' },
        { main: '#ffc107', light: '#fff3cd' },
        { main: '#17a2b8', light: '#d1ecf1' },
        { main: '#6f42c1', light: '#e2d6f3' },
        { main: '#fd7e14', light: '#ffe8d1' },
        { main: '#343a40', light: '#ced4da' }
    ];
    return colors[hash % colors.length];
}

exports.getTagsByUser = async (req, res) => {
    try {
        const userId = req.user._id;
        const tags = await Tag.find({ userId }).sort({ name: 1 });
        res.json({ message: "All tags retrived successfully", tags });
    } catch (error) {
        res.status(500).json({ message: error?.message || "Failed to fetch tags" });
    }
};


exports.createTag = async (req, res) => {
    try {
        const { _id: userId } = req.user;

        const assistantId = req.body.assistantId || userId;
        const name = req.body.name?.trim();
        const category = req.body.category?.trim() || '';
        const isFirstMessage = req.body.isFirstMessage || false;
        const isJourneyEvent = req.body.isJourneyEvent || false;
        const firstMessages = req.body.firstMessages || [];

        if (!name || !assistantId || !category) {
            return res.status(400).json({ message: "Tag name and assistantId are required." });
        }

        const regex = new RegExp(`^${name}$`, 'i');
        const existingTag = await Tag.findOne({ name: { $regex: regex }, userId });

        if (existingTag) {
            return res.status(400).json({ message: "Tag already exists." });
        }

        const displayColor = generateDisplayColor(name);

        const newTag = new Tag({
            name,
            category,
            isFirstMessage,
            isJourneyEvent,
            firstMessages,
            displayColor,
            assistantId,
            userId
        });

        await newTag.save();

        res.status(201).json({ message: "Tag created successfully", tag: newTag });
    } catch (error) {
        console.error("Create Tag Error:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};


exports.editTag = async (req, res) => {
    try {
        const { tagId } = req.params;
        const userId = req.user._id;

        const name = req.body.name?.trim();
        const category = req.body.category?.trim();
        const isFirstMessage = req.body.isFirstMessage;
        const isJourneyEvent = req.body.isJourneyEvent;
        const firstMessages = req.body.firstMessages;

        if (!name) {
            return res.status(400).json({ message: "New tag name is required." });
        }

        const regex = new RegExp(`^${name}$`, 'i');
        const existingTag = await Tag.findOne({
            _id: { $ne: tagId },
            userId,
            name: { $regex: regex }
        });

        if (existingTag) {
            return res.status(400).json({ message: "Another tag with this name already exists." });
        }

        const displayColor = generateDisplayColor(name);

        const updatedTag = await Tag.findOneAndUpdate(
            { _id: tagId, userId },
            {
                name,
                category,
                isFirstMessage,
                isJourneyEvent,
                firstMessages,
                displayColor
            },
            { new: true }
        );

        if (!updatedTag) {
            return res.status(404).json({ message: "Tag not found." });
        }

        res.status(200).json({ message: "Tag updated successfully", tag: updatedTag });
    } catch (error) {
        console.error("Edit Tag Error:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

exports.deleteTag = async (req, res) => {
    try {
        const { tagId } = req.params;
        const userId = req.user._id;

        const tag = await Tag.findOneAndDelete({ _id: tagId, userId });

        if (!tag) return res.status(404).json({ message: "Tag not found." });

        res.status(200).json({ message: "Tag deleted successfully", deletedTag: tag });
    } catch (error) {
        console.error("Delete Tag Error:", error);
        res.status(500).json({ message: error.message || "Internal server error" });
    }
};

exports.getUniqueTagCategories = async (req, res) => {
  try {
    const {_id:userId} = req.user;
    const categories = await Tag.distinct('category', { userId });
    res.status(200).json({
      message: "Unique categories fetched successfully",
      categories: categories.filter(Boolean)
    });
  } catch (error) {
    console.error("Get Unique Tag Categories Error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
