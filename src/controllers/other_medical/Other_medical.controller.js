import * as OtherMedicalService from "../../services/Other_medical/Other_medical.service.js";
import cloudinary from '../../utils/cloudinary.js'
import * as MedicalRecordService from "../../services/Medicail_record/Medical_record.service.js"; 


export const createOtherMedical = async (req, res) => {
    try {
        const userId = req.user?.id;
        let imageUrl = null;

        if (req.file) {
            const result = await cloudinary.uploader.upload(req.file.path);
            imageUrl = result.secure_url;
        }

        const data = imageUrl ? { ...req.body, Image: imageUrl } : req.body;

        const otherMedical = await OtherMedicalService.createOtherMedicalService(data, userId);
         res.status(201).json({
         status: 201,
         success: true,
         message: 'Create successfully',
         data: otherMedical
         })
    } catch (error) {
        res.status(error.status || 500).json({ message: error.message || "Internal server error" });
    }
};


export const getAllOtherMedical = async (req, res) => {
    try {
        const records = await OtherMedicalService.getAllOtherMedicalService();
         res.status(200).json({
         status: 200,
         success: true,
         message: 'fetched successfully',
         data: records
         })
    } catch (error) {
        res.status(500).json({ message: "Internal server error" });
    }
};


export const getOtherMedicalById = async (req, res) => {
    try {
        const record = await OtherMedicalService.getOtherMedicalByIdService(req.params.id);
        if (!record) {
            return res.status(404).json({ message: "Other medical record not found" });
        }
        res.status(200).json({
         status: 200,
         success: true,
         message: 'fetched successfully',
         data: record
         })
    } catch (error) {
        res.status(error.status || 500).json({ message: error.message || "Internal server error" });
    }
};


export const updateOtherMedical = async (req, res) => {
    try {
        let imageUrl = null;

        if (req.file) {
            const result = await cloudinary.uploader.upload(req.file.path);
            imageUrl = result.secure_url;
        }

        const data = imageUrl ? { ...req.body, Image: imageUrl } : req.body;
        const updated = await OtherMedicalService.updateOtherMedicalService(req.params.id, data);
        res.json(updated);
    } catch (error) {
        res.status(error.status || 500).json({ message: error.message || "Internal server error" });
    }
};

export const deleteOtherMedical = async (req, res) => {
    try {
        await OtherMedicalService.deleteOtherMedicalService(req.params.id);
        res.status(204).send();
    } catch (error) {
        res.status(error.status || 500).json({ message: error.message || "Internal server error" });
    }
};