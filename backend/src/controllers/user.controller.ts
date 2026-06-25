import { Response } from 'express';
import User from '../models/User.js';
import { AuthRequest } from '../types/index.js';

const VALID_CURRENCIES = ['USD', 'EUR', 'GBP', 'CAD', 'AUD', 'JPY', 'CHF', 'INR', 'MAD', 'AED', 'SAR', 'TRY', 'BRL', 'MXN', 'SGD', 'HKD', 'NOK', 'SEK', 'DKK', 'PLN'];

export const updateProfile = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { name, freelanceTitle, currency } = req.body;

    if (!name || name.trim().length < 2) {
      res.status(400).json({ success: false, message: 'Name must be at least 2 characters' });
      return;
    }

    const safeCurrency = VALID_CURRENCIES.includes(currency) ? currency : 'USD';

    const user = await User.findByIdAndUpdate(
      req.user?.id,
      { name: name.trim(), freelanceTitle: freelanceTitle?.trim() ?? '', currency: safeCurrency },
      { new: true, runValidators: true }
    ).select('-password');

    if (!user) {
      res.status(404).json({ success: false, message: 'User not found' });
      return;
    }

    res.json({ success: true, data: user });
  } catch {
    res.status(500).json({ success: false, message: 'Failed to update profile' });
  }
};

export const updatePassword = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      res.status(400).json({ success: false, message: 'Both current and new password are required' });
      return;
    }

    if (newPassword.length < 8) {
      res.status(400).json({ success: false, message: 'New password must be at least 8 characters' });
      return;
    }

    const user = await User.findById(req.user?.id);
    if (!user) {
      res.status(404).json({ success: false, message: 'User not found' });
      return;
    }

    const valid = await user.comparePassword(currentPassword);
    if (!valid) {
      res.status(401).json({ success: false, message: 'Current password is incorrect' });
      return;
    }

    user.password = newPassword;
    await user.save();

    res.json({ success: true, data: null });
  } catch {
    res.status(500).json({ success: false, message: 'Failed to update password' });
  }
};
