// Page de connexion (hors connexion)

// -> avec middleware de session :
// Page d'accueil (user connecté) 
// Liste des collaborateurs
// Édition du profil (user)
// Déconnexion

// Si admin (autre middleware)
// Ajouter un user 
// Modifier un user 
// Supprimer un user 

import express from 'express'
import { auth, isAdmin } from '../middlewares/auth.js'
const router = express.Router()

import UserController from '../controllers/UserController.js'

// Listes
router.get('/users', auth, UserController.getAllUsers)
//router.get('/users/:filter', UserController.getFilteredUsers)

// User CRUD
router.post('/login', UserController.login) // Action de connexion (post)
router.get('/logout', UserController.logout) // Déconnexion

router.get('/users/random', UserController.getRandomUser) // Récupère les infos d'un utilisateur random
router.get('/users/:id', UserController.getUserById) // Récupère les infos d'un utilisateur précis
router.put('/users/:id/edit', UserController.updateUser) // Modification du profil (post)

// Admin
router.post('/users/add', UserController.addUser) // Ajout d'utilisateur (post)
router.delete('/users/:id/delete', UserController.deleteUser) // Suppression d'utilisateur


export default router