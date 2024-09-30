const courseService = require('../services/historique_course_services');

const getCompletedCourses = async (req, res) => {
    const passagerId = req.params.id;

    try {
        const courses = await courseService.getCompletedCoursesByPassager(passagerId);
        res.status(200).json({ success: true, data: courses });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

const getCompletedCoursesByChauffeur = async (req, res) => {
    const chauffeurId = req.params.id;

    try {
        const courses = await courseService.getCompletedCoursesByChauffeur(chauffeurId);
        res.status(200).json({ success: true, data: courses });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

const findCompletedCoursesAll = async (req, res) => {
    try {
        const courses = await courseService.findCompletedCoursesAll();

        // Vérifier si des courses ont été trouvées
        if (!courses || courses.length === 0) {
            return res.status(404).json({ success: false, message: "Aucune course terminée trouvée." });
        }

        // Renvoyer les données si tout va bien
        res.status(200).json({ success: true, data: courses });
        
    } catch (error) {
        // Détail de l'erreur retournée
        res.status(500).json({
            success: false,
            message: 'Erreur lors de la récupération des courses terminées',
            error: error.message
        });
    }
};

const getCourseDetails = async (req, res) => {
    const courseId = req.params.id;

    try {
        const course = await courseService.getCourseDetailsById(courseId);
        if (course) {
            res.status(200).json({ success: true, data: course });
        } else {
            res.status(404).json({ success: false, message: 'Course not found' });
        }
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

module.exports = {
    getCompletedCourses,
    getCompletedCoursesByChauffeur,
    getCourseDetails,
    findCompletedCoursesAll
};
