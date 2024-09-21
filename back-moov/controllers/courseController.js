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

        console.log('ID de la course:', courseId);
    
        try {
            const courseDetails = await CourseService.getCourseDetailsById(courseId);
            if (courseDetails) {
                res.status(200).json({course: courseDetails});
            } else {
                res.status(404).json({ error: 'Détails de la course non trouvés' });
            }
        } catch (error) {
            console.error('Controller Error:', error.message);
            res.status(500).json({ error: error.message });
        }
    }

    static async listeReservationAttribues(req, res) {
        const chauffeurId = req.params.chauffeurId;

        try {
            const reservations = await Course.listeReservationAttribuees(chauffeurId);
            res.json({
                success: true,
                data: reservations
            })
        } catch(error) {
            console.error('Erreur lors de la récupération de la liste :', error);
            res.status(500).json({ 
                success: false, 
                message: 'Erreur serveur', 
                error: error.message 
            });
        }
    }
    
    static async getTotalDistanceByChauffeur(req, res) {
        const chauffeurId = req.user.id; // Vous pouvez adapter en fonction de votre logique

        try {
            const totalDistance = await Course.calculateTotalDistanceByChauffeur(chauffeurId);
            res.status(200).json({ total_distance: totalDistance });
        } catch (error) {
            console.error('Controller Error:', error.message);
            res.status(500).json({ error: error.message });
        }
    }

    static async getTotalDistanceByPassager(req, res) {
        const passagerId = req.user.id; // Vous pouvez adapter en fonction de votre logique

        try {
            const totalDistance = await Course.calculateTotalDistanceByPassager(passagerId);
            res.status(200).json({ total_distance: totalDistance });
        } catch (error) {
            console.error('Controller Error:', error.message);
            res.status(500).json({ error: error.message });
        }
    }

    static async getTotalReservationsByClient(req, res) {
        const clientId = req.user.id; // ID du client connecté

        try {
            const totalReservations = await CourseService.getTotalReservationsByClient(clientId);
            res.status(200).json({ total_reservations: totalReservations });
        } catch (error) {
            console.error('Controller Error:', error.message);
            res.status(500).json({ error: error.message });
        }
    }

    static async getTotalReservationsByChauffeur(req, res) {
        const chauffeurId = req.user.id; // ID du client connecté

        try {
            const totalReservations = await CourseService.getTotalReservationsByChauffeur(chauffeurId);
            res.status(200).json({ total_reservations: totalReservations });
        } catch (error) {
            console.error('Controller Error:', error.message);
            res.status(500).json({ error: error.message });
        }
    }

    static async commencerCourse(req, res) {
        const courseId = req.params.courseId;
        try {
            const commencerCourse = await Course.commencerCourse(courseId);
            res.status(200).json({ success: true,  data: commencerCourse });
        } catch(error) {
            console.error('Controller Error:', error.message);
            res.status(500).json({ error: error.message });
        }
    }

    static async terminerCourse(req, res) {
        const courseId = req.params.courseId;
        try {
            const terminerCourse = await Course.terminerCourse(courseId);
            res.status(200).json({ success: true,  data: terminerCourse });
        } catch(error) {
            console.error('Controller Error:', error.message);
            res.status(500).json({ error: error.message });
        }
    }
    
}

module.exports = CourseController;