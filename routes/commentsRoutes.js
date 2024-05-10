const express = require('express');
const router = express.Router();
const Comment = require('../models/Comment');
const Activity = require('../models/Activity');

// Route pour poster un commentaire sur une activité
router.post('/:activityId/comment', async (req, res) => {
  try {
    const { activityId } = req.params;
    const { user, content } = req.body;

    // Vérifier si l'activité est visible
    const activity = await Activity.findById(activityId);
    if (!activity) {
      return res.status(404).json({ message: 'Activité non trouvée' });
    }
    if (!activity.visibility) {
      return res.status(403).json({ message: 'L\'activité n\'est pas visible' });
    }

    // Vérifier si l'utilisateur est inscrit et validé par l'organisateur
    if (!activity.participants.includes(user)) {
      return res.status(403).json({ message: 'Vous devez être inscrit à l\'activité pour poster un commentaire' });
    }

    // Créer le commentaire
    const newComment = await Comment.create({ user, activity: activityId, content, date: new Date() });

    res.status(201).json(newComment);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Route pour récupérer les commentaires d'une activité
router.get('/:activityId/comments', async (req, res) => {
  try {
    const { activityId } = req.params;

    // Vérifier si l'activité est visible
    const activity = await Activity.findById(activityId);
    if (!activity) {
      return res.status(404).json({ message: 'Activité non trouvée' });
    }
    if (!activity.visibility) {
      return res.status(403).json({ message: 'L\'activité n\'est pas visible' });
    }

    // Récupérer les commentaires de l'activité
    const comments = await Comment.find({ activity: activityId }).populate('user', 'firstName lastName');
  
    res.json(comments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
