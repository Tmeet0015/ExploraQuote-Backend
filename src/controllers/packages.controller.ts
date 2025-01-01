import { Request, Response } from "express";
import { AppDataSource } from "../data-source";
import { Packages } from "../entity/packages";

  const packageRepository = AppDataSource.getRepository(Packages);

  export const createPackage = async (req: Request, res: Response) => {
    try {
      const packageData = packageRepository.create(req.body); 
      const savedPackage = await packageRepository.save(packageData);
      res.status(201).json(savedPackage);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  export const getPackages = async (req: Request, res: Response) => {
    try {
      const { page = 1, limit = 10, ...filters } = req.query;

      const [packages, total] = await packageRepository.findAndCount({
        where: { ...filters }, // Apply filters dynamically
        skip: (Number(page) - 1) * Number(limit),
        take: Number(limit),
      });

      res.status(200).json({ data: packages, total, page, limit });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  export const getPackageById = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const packageData = await packageRepository.findOneBy({ package_id: Number(id) });

      if (!packageData) {
        return res.status(404).json({ message: "Package not found" });
      }

      res.status(200).json(packageData);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  export const updatePackage = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      await packageRepository.update(id, req.body); // Update package
      const updatedPackage = await packageRepository.findOneBy({ package_id: Number(id) });

      if (!updatedPackage) {
        return res.status(404).json({ message: "Package not found" });
      }

      res.status(200).json(updatedPackage);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  export const deletePackage = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const deleteResult = await packageRepository.delete(id);

      if (!deleteResult.affected) {
        return res.status(404).json({ message: "Package not found" });
      }

      res.status(200).json({ message: "Package deleted successfully" });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
