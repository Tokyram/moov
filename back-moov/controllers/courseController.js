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

    static async findReservationAttente(req, res) {
        try {
            const page = parseInt(req.query.page) || 1;
            const limit = parseInt(req.query.limit) || 10; 

            const courses = await Course.findReservationAttente({ skip: (page - 1) * limit, limit });
            const total = await Course.countReservationAttente();

            res.json({
                success: true,
                data: courses.map(course => course.toJSON()),
                currentPage: page,
                totalPages: Math.ceil(total / limit),
                totalCourses: total
            });

        } catch(error) {
            console.error('Erreur lors de la récupération de la liste des réservation en cours:', error);
            res.status(500).json({ success: false, message: 'Erreur serveur', error: error.message });
        }
    }
}

module.exports = CourseController;