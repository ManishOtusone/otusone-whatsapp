const mongoose = require('mongoose');

const NodeSchema = new mongoose.Schema({
    id: { type: String, required: true },
    type: { type: String, required: true }, // 'custom'
    position: {
        x: { type: Number, required: true },
        y: { type: Number, required: true },
    },
    data: {
        label: { type: String, required: true },
        description: { type: String },
        icon: { type: String },
        type: { type: String }, // Custom type for logic (e.g., 'email', 'webhook')
        buttons: [
            {
                title: { type: String, required: true },
                payload: { type: String, required: true }, // payload or URL
                type: { type: String, enum: ['postback', 'url'], default: 'postback' },
                nextNodeId: { type: String },
            },
        ],
        inputs: { type: mongoose.Schema.Types.Mixed }, // Input parameters
        outputs: { type: mongoose.Schema.Types.Mixed }, // Output definitions
        settings: { type: mongoose.Schema.Types.Mixed }, // Configuration data
        meta: { type: mongoose.Schema.Types.Mixed }, // Any additional metadata
        nextNodeCondition: {
            type: String // e.g., "if service == 'graphics_design'"
        },
        conditionRoutes: {
            type: [{
                condition: { type: String, required: true },
                nextNodeId: { type: String, required: true }
            }],
            default: []
        }
    },
    style: { type: mongoose.Schema.Types.Mixed }, // e.g., colors, borders, etc.
    parentNode: { type: String }, // For nested nodes or groups
    draggable: { type: Boolean, default: true },
    deletable: { type: Boolean, default: true },
    selectable: { type: Boolean, default: true }
});

const EdgeSchema = new mongoose.Schema({
    id: { type: String, required: true }, // e.g., 'reactflow__edge-node1-node2'
    source: { type: String, required: true }, // node ID
    target: { type: String, required: true }, // node ID
    sourceHandle: { type: String },
    targetHandle: { type: String },
    type: { type: String, default: 'default' },
    animated: { type: Boolean, default: false },
    label: { type: String }, // Optional edge label
    style: { type: mongoose.Schema.Types.Mixed }, // Styling for edges
    data: { type: mongoose.Schema.Types.Mixed } // Custom edge data
});

const ChatbotSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    waPhoneNumberId: { type: String, required: true },
    name: { type: String, required: true },
    description: { type: String },

    type: { type: String, enum: ['basic', 'flow'], default: 'basic' },

    nodes: [NodeSchema],
    edges: [EdgeSchema],
    metadata: {
        version: { type: String, default: '1.0' },
        tags: { type: [String], default: [] },
        isPublic: { type: Boolean, default: false },
        category: { type: String }, // E.g., 'marketing', 'integration', etc.
        status: { type: String, enum: ['draft', 'active', 'archived'], default: 'draft' }
    },
    triggers: {
        onStart: { type: mongoose.Schema.Types.Mixed },
        onError: { type: mongoose.Schema.Types.Mixed }
    },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
});

ChatbotSchema.pre('save', function (next) {
    this.updatedAt = Date.now();
    next();
}, {
    versionKey: false,
    timestamps: true
});

module.exports = mongoose.model('Chatbot', ChatbotSchema);
