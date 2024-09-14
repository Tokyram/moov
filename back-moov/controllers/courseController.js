const Course = require('../models/course');

class CourseController {
    static async reserver(req, res) {
        try {
            const courseData = req.body;
            const nouvelleCourse = await Course.reserver(courseData);

            res.status(201).json({
                success: true,
                message: 'Course réservée avec succès',
                data: nouvelleCourse.toJSON()
            });
        } catch (error) {
            console.error('Erreur lors de la réservation de la course:', error);
            res.status(500).json({ 
                success: false, 
                message: 'Erreur serveur', 
                error: error.message 
            });
        }
    }
}

module.exports = CourseController;