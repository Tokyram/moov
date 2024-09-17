const Course = require('../models/course');
const { param } = require('../routes/courseRoute');
const CourseService = require('../services/course_service');
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

    static async accepterCourseChauffeur(req, res) {
        try {
            const { courseId, chauffeurId } = req.body;
            const findAcceptation = await Course.findConfirmationChauffeur(courseId, chauffeurId, 'ACCEPTE');

            if(findAcceptation > 0) {
                res.status(400).json({ success: false, message: 'Vous avez déjà accepté cette course' });
            }

            const confirmation = await Course.confirmationCourseChauffeur(courseId, chauffeurId, 'ACCEPTE');
            res.json({
                success: true,
                message: 'Course acceptée avec succès',
                data: confirmation
            })

        } catch(error) {
            console.error('Erreur lors de l\'acceptation de la course:', error);
            res.status(500).json({ 
                success: false, 
                message: 'Erreur serveur', 
                error: error.message 
            });
        }
    }

    static async refuserCourseChauffeur(req, res) {
        try {
            const { courseId, chauffeurId } = req.body;
            const findAcceptation = await Course.findConfirmationChauffeur(courseId, chauffeurId, 'REFUSE');

            if(findAcceptation > 0) {
                res.status(400).json({ success: false, message: 'Vous avez déjà refusé cette course' });
            }

            const confirmation = await Course.confirmationCourseChauffeur(courseId, chauffeurId, 'REFUSE');
            res.json({
                success: true,
                message: 'Course refusée avec succès',
                data: confirmation
            })

        } catch(error) {
            console.error('Erreur lors du refus de la course:', error);
            res.status(500).json({ 
                success: false, 
                message: 'Erreur serveur', 
                error: error.message 
            });
        }
    }

    static async getChauffeurAcceptes(req, res) {
        try {
            const { courseId } = req.params;
            const chauffeurs = await Course.getChauffeurAcceptes(courseId);

            res.json({
                success: true,
                data: chauffeurs
            });

        } catch(error) {
            console.error('Erreur lors de la récupération des chauffeurs:', error);
            res.status(500).json({ 
                success: false, 
                message: 'Erreur serveur', 
                error: error.message 
            });
        }
    }

    static async getCourseDetails(req, res) {
        const courseId = req.params.courseId;
        const userId = req.user.id;
        
        console.log('ID de la course:', courseId);
        console.log('ID de l\'utilisateur connecté:', userId);
    
        try {
            const courseDetails = await CourseService.getCourseDetailsById(courseId, userId);
            if (courseDetails) {
                res.status(200).json(courseDetails);
            } else {
                res.status(404).json({ error: 'Détails de la course non trouvés' });
            }
        } catch (error) {
            console.error('Controller Error:', error.message);
            res.status(500).json({ error: error.message });
        }
    }
    
}

module.exports = CourseController;