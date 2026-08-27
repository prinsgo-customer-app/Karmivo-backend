const Address = require('../models/Address');
const { successResponse, errorResponse } = require('../utils/response');

const getAddresses = async (req, res, next) => {
  try {
    const addresses = await Address.find({ user: req.user._id }).sort('-isDefault -createdAt');
    return successResponse(res, 200, 'Addresses retrieved', { addresses });
  } catch (error) {
    next(error);
  }
};

const createAddress = async (req, res, next) => {
  try {
    const addressCount = await Address.countDocuments({ user: req.user._id });
    const isDefault = req.body.isDefault !== undefined ? req.body.isDefault : addressCount === 0;

    if (isDefault) {
      await Address.updateMany({ user: req.user._id }, { isDefault: false });
    }

    const address = await Address.create({
      ...req.body,
      user: req.user._id,
      isDefault
    });

    return successResponse(res, 201, 'Address created', { address });
  } catch (error) {
    next(error);
  }
};

const updateAddress = async (req, res, next) => {
  try {
    const { id } = req.params;
    const updateData = { ...req.body };
    delete updateData.user;

    if (updateData.isDefault) {
      await Address.updateMany({ user: req.user._id }, { isDefault: false });
    }

    const address = await Address.findOneAndUpdate(
      { _id: id, user: req.user._id },
      { $set: updateData },
      { new: true }
    );

    if (!address) {
      return errorResponse(res, 404, 'Address not found');
    }

    return successResponse(res, 200, 'Address updated', { address });
  } catch (error) {
    next(error);
  }
};

const deleteAddress = async (req, res, next) => {
  try {
    const { id } = req.params;
    const address = await Address.findOneAndDelete({ _id: id, user: req.user._id });

    if (!address) {
      return errorResponse(res, 404, 'Address not found');
    }

    if (address.isDefault) {
        const fallbackAddress = await Address.findOne({ user: req.user._id });
        if (fallbackAddress) {
            fallbackAddress.isDefault = true;
            await fallbackAddress.save();
        }
    }

    return successResponse(res, 200, 'Address deleted', { address });
  } catch (error) {
    next(error);
  }
};

const setDefaultAddress = async (req, res, next) => {
  try {
    const { id } = req.params;

    const address = await Address.findOne({ _id: id, user: req.user._id });
    if (!address) {
      return errorResponse(res, 404, 'Address not found');
    }

    await Address.updateMany({ user: req.user._id }, { isDefault: false });

    address.isDefault = true;
    await address.save();

    return successResponse(res, 200, 'Default address updated', { address });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAddresses,
  createAddress,
  updateAddress,
  deleteAddress,
  setDefaultAddress,
};
