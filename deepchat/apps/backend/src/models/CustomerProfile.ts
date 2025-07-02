import { Schema, model, Document, Types } from 'mongoose';

export type CustomerStatus = 'New' | 'Contacted' | 'Qualified' | 'Unqualified';
export type CustomerTag = 'Lead' | 'VIP' | 'Blocked' | 'Cold' | 'Interested';

export interface ICustomerProfile extends Document {
    phone: string; // The customer's phone number
    name: string;
    tags: CustomerTag[];
    status: CustomerStatus;
    lastInteraction: Date;
    assignedTo: Types.ObjectId | null; // User ID of the agent
    lineId: string; // Which of our lines they contacted
    createdAt: Date;
    updatedAt: Date;
}

const CustomerProfileSchema = new Schema<ICustomerProfile>({
    phone: {
        type: String,
        required: true,
        unique: true, // A customer is unique by their phone number across the system
        index: true,
    },
    name: {
        type: String,
        default: function() {
            // Default name to "Customer" + last 4 digits of phone
            return `Customer ${this.phone.slice(-4)}`;
        }
    },
    tags: [{
        type: String,
        enum: ['Lead', 'VIP', 'Blocked', 'Cold', 'Interested'],
    }],
    status: {
        type: String,
        enum: ['New', 'Contacted', 'Qualified', 'Unqualified'],
        default: 'New',
    },
    lastInteraction: {
        type: Date,
        default: Date.now,
    },
    assignedTo: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        default: null,
    },
    lineId: {
        type: String,
        required: true,
    },
}, { timestamps: true }); // Automatically adds createdAt and updatedAt

const CustomerProfile = model<ICustomerProfile>('CustomerProfile', CustomerProfileSchema);

export default CustomerProfile; 