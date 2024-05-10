const express = require('express');
const router = express.Router();
const verifyToken = require('../middleware/authMiddleware');

const Notification = require('../models/Notification');

router.get('/', verifyToken, async (req, res) => {
  try {
    const id = req.user;

    // Récupérer les notifications non vues pour l'utilisateur actuel
    const unseenNotificationsCount = await Notification.countDocuments({ recipient: id, vu: false });

    // Récupérer toutes les notifications pour d'autres utilisateurs, triées par ordre décroissant de la date
    const notifications = await Notification.find({ recipient: id  }).sort({ date: -1 });

    // Renvoyer les notifications et le nombre de notifications non vues
    res.json({ notifications, unseenNotificationsCount });
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la récupération des notifications.' });
  }
});



router.get('/notiifcationNav', verifyToken, async (req, res) => {
  try {
    const id = req.user;
    const page = parseInt(req.query.page) || 1;
    const pageSize = parseInt(req.query.pageSize) || 5;

    const skip = (page - 1) * pageSize;
    const unseenNotificationsCount = await Notification.countDocuments({ recipient: id, vu: false });

    // Récupérer les notifications paginées pour l'utilisateur actuel avec le filtre sur le type
    const notifications = await Notification.find({ 
      recipient: id,
      $or: [
        { type: 'add_friends' },
        { type: 'add_friends_private' }
      ]
    }).sort({ date: -1 }).skip(skip).limit(pageSize);

    // Renvoyer les notifications paginées
    res.json({ notifications, unseenNotificationsCount });
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la récupération des notifications.' });
  }
});

  
  
  router.put('/:notificationId/markAsRead/', async (req, res) => {
    try {
      const { notificationId } = req.params;
      console.log(notificationId);
      await Notification.findByIdAndUpdate(notificationId, { $set: { vuByUser: true } });
      res.status(200).json({ message: 'Notification marquée comme lue avec succès.' });
    } catch (error) {
      console.error('Erreur lors de la mise à jour du statut de la notification:', error);
      res.status(500).json({ message: 'Erreur lors de la mise à jour du statut de la notification.' });
    }
  });
  



  router.put('/markAllAsRead', async (req, res) => {
    try {
      const { notificationIds } = req.body;
  
      // Vérifier s'il y a des IDs de notifications spécifiés
      if (notificationIds && notificationIds.length > 0) {
        // Vérifier si toutes les notifications spécifiées ont déjà le statut "vu" à true
        const notificationsAlreadyRead = await Notification.find({ _id: { $in: notificationIds }, vu: true });
  
        // Si toutes les notifications spécifiées sont déjà lues, renvoyer une réponse indiquant qu'aucune action n'est nécessaire
        if (notificationsAlreadyRead.length === notificationIds.length) {
          return res.status(200).json({ message: 'Toutes les notifications sont déjà marquées comme lues' });
        }
  
        // Mettre à jour le statut "vu" de toutes les notifications avec les IDs spécifiés qui ne sont pas déjà lues
        await Notification.updateMany({ _id: { $in: notificationIds }, vu: false }, { vu: true });
        res.status(200).json({ message: 'Toutes les notifications ont été marquées comme lues avec succès' });
      } else {
        res.status(400).json({ message: 'Aucune notification à mettre à jour' });
      }
    } catch (error) {
      res.status(400).json({ message: 'Erreur lors de la mise à jour du statut de toutes les notifications' });
    }
  });
  
  
  


  module.exports = router;
