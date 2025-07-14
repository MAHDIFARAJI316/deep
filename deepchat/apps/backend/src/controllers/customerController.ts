import { Response } from 'express';
import { IAuthRequest } from '@backend/middlewares/authMiddleware';
import CustomerProfile from '@backend/models/CustomerProfile';
import Message from '@backend/models/Message';
import { z } from 'zod';

export const getCustomersHandler = async (req: IAuthRequest, res: Response) => {
    try {
        const { search = '', status, tag, page = 1, limit = 10 } = req.query;

        const query: any = { assignedTo: req.user!._id };
        if (search) {
            query.phone = { $regex: search, $options: 'i' };
        }
        if (status) query.status = status;
        if (tag) query.tags = tag;

        const customers = await CustomerProfile.find(query)
            .limit(Number(limit))
            .skip((Number(page) - 1) * Number(limit))
            .sort({ lastInteraction: -1 });
            
        const total = await CustomerProfile.countDocuments(query);

        res.status(200).json({
            customers,
            totalPages: Math.ceil(total / Number(limit)),
            currentPage: Number(page),
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

export const getCustomerByIdHandler = async (req: IAuthRequest, res: Response) => {
    try {
        const { id } = req.params;
        const customer = await CustomerProfile.findById(id);

        if (!customer || customer.assignedTo?.toString() !== (req.user!._id as any).toString()) {
            return res.status(404).json({ message: 'Customer not found' });
        }
        
        const messages = await Message.find({ customerId: id }).sort({ timestamp: 'asc' });

        res.status(200).json({ customer, messages });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

const updateCustomerSchema = z.object({
    name: z.string().optional(),
    tags: z.array(z.enum(['Lead', 'VIP', 'Blocked', 'Cold', 'Interested'])).optional(),
    status: z.enum(['New', 'Contacted', 'Qualified', 'Unqualified']).optional(),
});

export const updateCustomerHandler = async (req: IAuthRequest, res: Response) => {
    try {
        const { id } = req.params;
        const validation = updateCustomerSchema.safeParse(req.body);

        if (!validation.success) {
            return res.status(400).json({ message: 'Invalid data', errors: validation.error.errors });
        }

        const customer = await CustomerProfile.findById(id);
        if (!customer || customer.assignedTo?.toString() !== (req.user!._id as any).toString()) {
            return res.status(404).json({ message: 'Customer not found' });
        }

        const updatedCustomer = await CustomerProfile.findByIdAndUpdate(id, validation.data, { new: true });
        res.status(200).json(updatedCustomer);

    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
}; 