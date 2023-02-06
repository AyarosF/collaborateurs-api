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
const router = express.Router()

import UserController from '../controllers/UserController.js'

// Liste
router.get('/', UserController.getUsers) // Affichage de la liste des collaborateurs

// User CRUD
router.get('/login', UserController.getLoginForm) // Page de connexion
router.post('/login', UserController.login) // Action de connexion (post)
router.get('/profile/:id', UserController.profile) // Modification du profil
router.post('/update', UserController.updateUser) // Modification du profil (post)
router.get('/logout', UserController.logout) // Déconnexion

// Admin
router.post('/add', UserController.addUser) // Ajout d'utilisateur (post)
router.get('/delete/:id', UserController.deleteUser) // Suppression d'utilisateur


export default router