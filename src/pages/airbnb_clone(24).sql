-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Hôte : 127.0.0.1
-- Généré le : lun. 23 juin 2025 à 19:56
-- Version du serveur : 10.4.32-MariaDB
-- Version de PHP : 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de données : `airbnb_clone`
--

-- --------------------------------------------------------

--
-- Structure de la table `agents`
--

CREATE TABLE `agents` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `full_name` varchar(255) DEFAULT NULL,
  `phone` varchar(20) DEFAULT NULL,
  `email` varchar(100) DEFAULT NULL,
  `region` varchar(100) DEFAULT NULL,
  `status` enum('actif','inactif') DEFAULT 'actif',
  `created_at` datetime DEFAULT current_timestamp(),
  `code_agent` varchar(50) DEFAULT NULL,
  `solde` decimal(10,2) DEFAULT 0.00,
  `statut_code` enum('creer','non_creer') NOT NULL DEFAULT 'non_creer'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `agents`
--

INSERT INTO `agents` (`id`, `user_id`, `full_name`, `phone`, `email`, `region`, `status`, `created_at`, `code_agent`, `solde`, `statut_code`) VALUES
(1, 1, 'Jean Paul', '0651234567', 'jp@example.com', 'Pointe-Noire', 'actif', '2025-06-09 13:54:01', 'JP001', 25000.00, 'creer'),
(2, 2, 'Alice Bemba', '0676543210', 'aliceb@example.com', 'Brazzaville', 'actif', '2025-06-09 13:54:01', 'AB002', 30500.00, 'creer'),
(3, 3, 'Carlos Doudou', '0698123476', 'carlosd@example.com', 'Dolisie', 'actif', '2025-06-09 13:54:01', 'CD003', 12000.00, 'creer');

-- --------------------------------------------------------

--
-- Structure de la table `agent_code_usages`
--

CREATE TABLE `agent_code_usages` (
  `id` int(11) NOT NULL,
  `agent_id` int(11) NOT NULL,
  `booking_id` int(11) DEFAULT NULL,
  `listing_id` int(11) DEFAULT NULL,
  `user_id` int(11) NOT NULL,
  `code_agent` varchar(50) NOT NULL,
  `commission_earned` decimal(10,2) DEFAULT 0.00,
  `used_at` datetime DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `agent_code_usages`
--

INSERT INTO `agent_code_usages` (`id`, `agent_id`, `booking_id`, `listing_id`, `user_id`, `code_agent`, `commission_earned`, `used_at`) VALUES
(1, 1, 1, 1, 1, 'JP001', 2000.00, '2025-06-09 13:54:14'),
(2, 2, 2, 2, 2, 'AB002', 1500.00, '2025-06-09 13:54:14'),
(3, 3, 3, 3, 3, 'CD003', 1800.00, '2025-06-09 13:54:14');

-- --------------------------------------------------------

--
-- Structure de la table `agent_publications`
--

CREATE TABLE `agent_publications` (
  `id` int(11) NOT NULL,
  `agent_id` int(11) NOT NULL,
  `listing_id` int(11) DEFAULT NULL,
  `vehicule_id` int(11) DEFAULT NULL,
  `type` enum('logement','vehicule') NOT NULL,
  `commission_amount` decimal(10,2) DEFAULT 0.00,
  `status` enum('en_attente','valide','refuse','payé') DEFAULT 'en_attente',
  `created_at` datetime DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `agent_publications`
--

INSERT INTO `agent_publications` (`id`, `agent_id`, `listing_id`, `vehicule_id`, `type`, `commission_amount`, `status`, `created_at`) VALUES
(1, 1, 1, NULL, 'logement', 3000.00, 'valide', '2025-06-09 13:54:29'),
(2, 2, NULL, 1, 'vehicule', 5000.00, 'en_attente', '2025-06-09 13:54:29'),
(3, 3, 2, NULL, 'logement', 2500.00, 'payé', '2025-06-09 13:54:29');

-- --------------------------------------------------------

--
-- Structure de la table `availabilities`
--

CREATE TABLE `availabilities` (
  `id` int(11) NOT NULL,
  `listing_id` int(11) DEFAULT NULL,
  `date` date DEFAULT NULL,
  `is_available` tinyint(1) DEFAULT 1,
  `custom_price` decimal(10,2) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `availabilities`
--

INSERT INTO `availabilities` (`id`, `listing_id`, `date`, `is_available`, `custom_price`) VALUES
(77, 1, '2025-04-25', 0, NULL),
(78, 1, '2025-04-26', 0, NULL),
(79, 1, '2025-04-27', 0, NULL),
(80, 1, '2025-04-28', 0, NULL),
(81, 1, '2025-04-29', 0, NULL),
(82, 1, '2025-04-30', 0, NULL),
(83, 1, '2025-05-01', 0, NULL),
(84, 1, '2025-05-02', 0, NULL),
(85, 1, '2025-05-03', 0, NULL),
(86, 1, '2025-05-04', 0, NULL),
(87, 1, '2025-05-19', 0, NULL),
(88, 1, '2025-05-20', 0, NULL),
(89, 2, '2025-05-21', 0, NULL),
(90, 1, '2025-05-22', 0, NULL),
(96, 1, '2025-05-11', 0, NULL),
(97, 1, '2025-05-12', 0, NULL),
(98, 1, '2025-05-13', 0, NULL),
(100, 1, '2025-05-05', 0, NULL),
(101, 1, '2025-05-06', 0, NULL),
(102, 1, '2025-05-07', 0, NULL),
(103, 1, '2025-05-08', 0, NULL),
(104, 2, '2025-04-29', 0, NULL),
(105, 1, '2025-05-14', 0, NULL),
(106, 1, '2025-05-15', 0, NULL),
(107, 1, '2025-05-16', 0, NULL),
(108, 1, '2025-05-23', 0, NULL),
(110, 1, '2025-05-09', 0, NULL),
(394, 1, '2025-05-25', 1, 200.00),
(395, 1, '2025-05-26', 1, 200.00),
(396, 1, '2025-05-27', 1, 200.00),
(399, 1, '2025-05-30', 1, 200.00),
(400, 1, '2025-05-31', 1, 200.00),
(401, 1, '2025-06-01', 1, 200.00),
(402, 1, '2025-06-02', 1, 200.00),
(403, 1, '2025-06-03', 1, 200.00),
(404, 1, '2025-06-04', 1, 200.00),
(405, 1, '2025-06-05', 1, 200.00),
(406, 1, '2025-06-06', 1, 200.00),
(407, 1, '2025-06-07', 1, 200.00),
(408, 1, '2025-06-08', 1, 200.00),
(409, 1, '2025-06-09', 1, 200.00),
(410, 1, '2025-06-10', 1, 200.00),
(411, 1, '2025-06-11', 1, 200.00),
(412, 1, '2025-06-12', 1, 200.00),
(413, 1, '2025-06-13', 1, 200.00),
(414, 1, '2025-06-14', 1, 200.00),
(415, 1, '2025-06-15', 1, 200.00),
(416, 1, '2025-06-16', 1, 200.00),
(417, 1, '2025-06-17', 1, 200.00),
(418, 1, '2025-06-18', 1, 200.00),
(419, 1, '2025-06-19', 1, 200.00),
(420, 1, '2025-06-20', 1, 200.00),
(421, 1, '2025-06-21', 1, 200.00),
(422, 1, '2025-06-22', 1, 200.00),
(423, 1, '2025-06-23', 1, 200.00),
(424, 1, '2025-06-24', 1, 200.00),
(425, 1, '2025-06-25', 1, 200.00),
(426, 1, '2025-06-26', 1, 200.00),
(427, 1, '2025-06-27', 1, 200.00),
(428, 1, '2025-06-28', 1, 200.00),
(429, 1, '2025-06-29', 1, 200.00),
(430, 1, '2025-06-30', 1, 200.00),
(431, 1, '2025-07-01', 1, 200.00),
(432, 1, '2025-07-02', 1, 200.00),
(433, 1, '2025-07-03', 1, 200.00),
(434, 1, '2025-07-04', 1, 200.00),
(435, 1, '2025-07-05', 1, 200.00),
(436, 1, '2025-07-06', 1, 200.00),
(437, 1, '2025-07-07', 1, 200.00),
(438, 1, '2025-07-08', 1, 200.00),
(439, 1, '2025-07-09', 1, 200.00),
(440, 1, '2025-07-10', 1, 200.00),
(441, 1, '2025-07-11', 1, 200.00),
(442, 1, '2025-07-12', 1, 200.00),
(443, 1, '2025-07-13', 1, 200.00),
(444, 1, '2025-07-14', 1, 200.00),
(445, 1, '2025-07-15', 1, 200.00),
(446, 1, '2025-07-16', 1, 200.00),
(447, 1, '2025-07-17', 1, 200.00),
(448, 1, '2025-07-18', 1, 200.00),
(449, 1, '2025-07-19', 1, 200.00),
(450, 1, '2025-07-20', 1, 200.00),
(451, 1, '2025-07-21', 1, 200.00),
(452, 1, '2025-07-22', 1, 200.00),
(453, 1, '2025-07-23', 1, 200.00),
(454, 1, '2025-07-24', 1, 200.00),
(455, 1, '2025-07-25', 1, 200.00),
(456, 1, '2025-07-26', 1, 200.00),
(457, 1, '2025-07-27', 1, 200.00),
(458, 1, '2025-07-28', 1, 200.00),
(459, 1, '2025-07-29', 1, 200.00),
(460, 1, '2025-07-30', 1, 200.00),
(461, 1, '2025-07-31', 1, 200.00),
(462, 1, '2025-08-01', 1, 200.00),
(463, 1, '2025-08-02', 1, 200.00),
(464, 1, '2025-08-03', 1, 200.00),
(465, 1, '2025-08-04', 1, 200.00),
(466, 1, '2025-08-05', 1, 200.00),
(467, 1, '2025-08-06', 1, 200.00),
(468, 1, '2025-08-07', 1, 200.00),
(469, 1, '2025-08-08', 1, 200.00),
(470, 1, '2025-08-09', 1, 200.00),
(471, 1, '2025-05-28', 1, 566.00),
(472, 1, '2025-05-29', 1, 566.00);

-- --------------------------------------------------------

--
-- Structure de la table `availabilities_agent`
--

CREATE TABLE `availabilities_agent` (
  `id` int(11) NOT NULL,
  `agent_id` int(11) DEFAULT NULL,
  `vehicule_id` int(11) DEFAULT NULL,
  `listings_id` int(11) DEFAULT NULL,
  `date` date NOT NULL,
  `is_available` tinyint(1) DEFAULT 1,
  `heure_arrivee` time DEFAULT NULL,
  `heure_fin` time DEFAULT NULL,
  `created_at` datetime DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `availabilities_agent`
--

INSERT INTO `availabilities_agent` (`id`, `agent_id`, `vehicule_id`, `listings_id`, `date`, `is_available`, `heure_arrivee`, `heure_fin`, `created_at`) VALUES
(6, 2, NULL, NULL, '2025-06-27', 0, NULL, NULL, '2025-06-23 01:20:46');

-- --------------------------------------------------------

--
-- Structure de la table `availabilities_cars`
--

CREATE TABLE `availabilities_cars` (
  `id` int(11) NOT NULL,
  `vehicule_id` int(11) NOT NULL,
  `date` date NOT NULL,
  `is_available` tinyint(1) DEFAULT 1,
  `custom_price` decimal(10,2) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `availabilities_cars`
--

INSERT INTO `availabilities_cars` (`id`, `vehicule_id`, `date`, `is_available`, `custom_price`) VALUES
(1, 1, '2025-05-22', 1, NULL);

-- --------------------------------------------------------

--
-- Structure de la table `bookings`
--

CREATE TABLE `bookings` (
  `id` int(11) NOT NULL,
  `code_reservation` varchar(100) DEFAULT NULL,
  `user_id` int(11) DEFAULT NULL,
  `listing_id` int(11) DEFAULT NULL,
  `check_in` date DEFAULT NULL,
  `check_out` date DEFAULT NULL,
  `total_price` int(11) DEFAULT NULL,
  `status` enum('pending','confirmed','cancelled') DEFAULT 'pending',
  `motif` text DEFAULT NULL,
  `created_at` datetime DEFAULT current_timestamp(),
  `etat` enum('payer','non_payer','partiel') DEFAULT 'non_payer',
  `code_agent` varchar(50) DEFAULT NULL,
  `rental_type` enum('courte','mensuel','achat') NOT NULL,
  `check_in_hours` time DEFAULT NULL,
  `date_visite` date DEFAULT NULL,
  `heure_visite` time DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `bookings`
--

INSERT INTO `bookings` (`id`, `code_reservation`, `user_id`, `listing_id`, `check_in`, `check_out`, `total_price`, `status`, `motif`, `created_at`, `etat`, `code_agent`, `rental_type`, `check_in_hours`, `date_visite`, `heure_visite`) VALUES
(1, 'mmkk', 1, 1, '2025-05-05', '2025-05-12', 49212, 'confirmed', NULL, '2025-04-25 14:22:57', 'payer', 'CD003', 'courte', NULL, NULL, NULL),
(2, NULL, 1, 1, '2025-06-10', '2025-06-21', 16404, 'pending', NULL, '2025-04-25 15:53:21', 'non_payer', 'JP001', 'courte', NULL, NULL, NULL),
(3, NULL, 1, 1, '2025-05-05', '2025-05-07', 32808, 'pending', NULL, '2025-04-25 16:00:52', 'non_payer', NULL, 'courte', NULL, NULL, NULL),
(4, NULL, 1, 1, '2025-05-07', '2025-05-09', 32808, 'pending', NULL, '2025-04-25 16:42:19', 'non_payer', NULL, 'courte', NULL, NULL, NULL),
(6, NULL, 1, 1, '2025-05-14', '2025-05-17', 49212, 'pending', NULL, '2025-05-04 19:18:00', 'non_payer', NULL, 'courte', NULL, NULL, NULL),
(7, NULL, 1, 1, '2025-05-23', '2025-05-24', 16404, 'pending', NULL, '2025-05-04 19:18:14', 'non_payer', NULL, 'courte', NULL, NULL, NULL),
(8, NULL, 1, 1, '2025-05-30', '2025-05-31', 16404, 'confirmed', NULL, '2025-05-04 19:21:43', 'payer', NULL, 'courte', NULL, NULL, NULL),
(9, 'kjll', 2, 19, '2025-06-15', '2025-06-23', 55666, 'pending', NULL, '2025-06-14 17:32:07', 'non_payer', 'AB002', 'courte', NULL, NULL, NULL),
(12, 'RES6855DFC3EB0AD', 1, 41, '2025-06-22', '2025-06-25', 30000, 'pending', NULL, '2025-06-21 00:25:07', 'non_payer', NULL, 'courte', '00:00:00', NULL, NULL),
(13, 'RES6857D4657EE2F', 1, 41, '2025-06-22', '2025-06-24', 20000, 'pending', NULL, '2025-06-22 12:01:09', 'non_payer', NULL, 'courte', '00:00:00', NULL, NULL),
(14, 'RES6857D4A57EC1C', 1, 41, '2025-06-22', '2025-06-24', 20000, 'pending', NULL, '2025-06-22 12:02:13', 'non_payer', NULL, 'courte', '00:00:00', NULL, NULL),
(15, 'RES6857D87BD6647', 1, 41, '2025-06-22', '2025-06-26', 40000, 'pending', NULL, '2025-06-22 12:18:35', 'non_payer', 'JP001', 'courte', '00:00:00', NULL, NULL),
(16, 'RES6857DCA9624C2', 1, 41, '2025-06-22', '2025-06-24', 20000, 'pending', NULL, '2025-06-22 12:36:25', 'non_payer', NULL, 'courte', '00:00:00', NULL, NULL),
(17, 'RES6857DF0D312A8', 1, 41, '2025-06-22', '2025-06-26', 40000, 'pending', NULL, '2025-06-22 12:46:37', 'non_payer', NULL, 'courte', '00:00:00', NULL, NULL),
(18, 'RES6857DF9DBE915', 1, 41, '2025-06-22', '2025-06-27', 50000, 'pending', NULL, '2025-06-22 12:49:01', 'non_payer', NULL, 'courte', '00:00:00', NULL, NULL),
(19, 'RES6857DFC234821', 1, 41, '2025-06-22', '2025-06-27', 50000, 'pending', NULL, '2025-06-22 12:49:38', 'non_payer', NULL, 'courte', '00:00:00', NULL, NULL),
(20, 'RES6857E069E8FBF', 1, 41, '2025-06-22', '2025-06-28', 60000, 'pending', NULL, '2025-06-22 12:52:25', 'non_payer', NULL, 'courte', '00:00:00', NULL, NULL),
(21, 'RES6857E20701277', 1, 41, '2025-06-22', '2025-06-26', 40000, 'pending', NULL, '2025-06-22 12:59:19', 'non_payer', NULL, 'courte', '00:00:00', NULL, NULL),
(22, 'RES6857E2183C850', 1, 41, '2025-06-22', '2025-06-26', 40000, 'pending', NULL, '2025-06-22 12:59:36', 'non_payer', NULL, 'courte', '00:00:00', NULL, NULL),
(23, 'RES6857E2A4ED546', 1, 41, '2025-06-22', '2025-06-28', 60000, 'pending', NULL, '2025-06-22 13:01:56', 'non_payer', NULL, 'courte', '00:00:00', NULL, NULL),
(24, 'RES6857E3372F47D', 1, 41, '2025-06-22', '2025-06-28', 60000, 'pending', NULL, '2025-06-22 13:04:23', 'non_payer', NULL, 'courte', '00:00:00', NULL, NULL),
(25, 'RES6857E3DAC599D', 1, 41, '2025-06-22', '2025-06-30', 80000, 'pending', NULL, '2025-06-22 13:07:06', 'non_payer', NULL, 'courte', '00:00:00', NULL, NULL),
(26, 'RES685812A5364B3', 1, 6, '2025-06-22', '2025-06-25', 73002, 'pending', NULL, '2025-06-22 16:26:45', 'non_payer', NULL, 'courte', '00:00:00', NULL, NULL),
(27, 'RES68585E481BCC5', 1, 41, '2025-06-22', '2025-06-26', 40000, 'pending', NULL, '2025-06-22 21:49:28', 'non_payer', NULL, 'courte', '00:00:00', NULL, NULL),
(28, 'RES68585FAB12B15', 1, 41, '2025-06-22', '2025-06-24', 20000, 'pending', NULL, '2025-06-22 21:55:23', 'non_payer', NULL, 'courte', '15:00:00', NULL, NULL),
(29, 'RES6858603A4EAE9', 1, 41, '2025-06-29', '2025-06-30', 10000, 'pending', NULL, '2025-06-22 21:57:46', 'non_payer', NULL, 'courte', '14:00:00', NULL, NULL),
(30, 'FLX68586D7415B99', 1, 43, NULL, NULL, 3000, 'pending', NULL, '2025-06-22 22:54:12', 'non_payer', NULL, 'achat', '15:00:00', '2025-06-24', '15:00:00'),
(31, 'FLX68586DE1B8E4E', 1, 43, NULL, NULL, 3000, 'pending', NULL, '2025-06-22 22:56:01', 'non_payer', NULL, 'achat', '16:00:00', '2025-06-24', '16:00:00'),
(32, 'FLX68586E54565E3', 1, 43, NULL, NULL, 3000, 'pending', NULL, '2025-06-22 22:57:56', 'non_payer', NULL, 'achat', '09:00:00', '2025-06-28', '09:00:00'),
(33, 'FLX68586F6382D9F', 1, 43, NULL, NULL, 3000, 'pending', NULL, '2025-06-22 23:02:27', 'non_payer', NULL, 'achat', '12:00:00', '2025-06-23', '12:00:00'),
(34, 'FLX6858711A84EFD', 1, 43, NULL, NULL, 3000, 'pending', NULL, '2025-06-22 23:09:46', 'non_payer', NULL, 'achat', '16:00:00', '2025-06-26', '16:00:00'),
(35, 'FLX6858720ED0DDA', 1, 43, NULL, NULL, 3000, 'pending', NULL, '2025-06-22 23:13:50', 'non_payer', NULL, 'achat', '10:00:00', '2025-06-23', '10:00:00'),
(36, 'FLX685872C89DA8B', 1, 43, NULL, NULL, 3000, 'pending', NULL, '2025-06-22 23:16:56', 'non_payer', NULL, 'achat', '12:00:00', '2025-06-23', '12:00:00'),
(37, 'FLX6858738B22078', 1, 43, NULL, NULL, 3000, 'pending', NULL, '2025-06-22 23:20:11', 'non_payer', NULL, 'achat', '13:00:00', '2025-06-23', '13:00:00'),
(38, 'FLX6858802E5B64A', 1, 43, NULL, NULL, 3000, 'pending', NULL, '2025-06-23 00:14:06', 'non_payer', NULL, 'achat', '10:00:00', '2025-06-24', '10:00:00'),
(39, 'FLX6858812B72BA1', 1, 43, NULL, NULL, 3000, 'confirmed', NULL, '2025-06-23 00:18:19', 'payer', NULL, 'achat', '11:00:00', '2025-06-24', '11:00:00');

-- --------------------------------------------------------

--
-- Structure de la table `bookings_cars`
--

CREATE TABLE `bookings_cars` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `vehicule_id` int(11) NOT NULL,
  `check_in` date NOT NULL,
  `check_out` date NOT NULL,
  `total_price` decimal(10,2) DEFAULT 0.00,
  `status` enum('pending','confirmed','cancelled') DEFAULT 'pending',
  `created_at` datetime DEFAULT current_timestamp(),
  `rental_type` enum('courte','mensuel','achat') NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Structure de la table `booking_agent`
--

CREATE TABLE `booking_agent` (
  `id` int(11) NOT NULL,
  `agent_id` int(11) NOT NULL,
  `listing_id` int(11) DEFAULT NULL,
  `vehicule_id` int(11) DEFAULT NULL,
  `user_id` int(11) NOT NULL,
  `date` date NOT NULL,
  `heure_arrivee` time DEFAULT NULL,
  `heure_fin` time DEFAULT NULL,
  `statut` enum('en attente','confirmer','annuler') DEFAULT 'en attente',
  `code_reservation` varchar(50) NOT NULL,
  `booking_price` decimal(10,2) DEFAULT 0.00,
  `final_price` decimal(10,2) DEFAULT 0.00,
  `statut_final_price` enum('payer','non payer','en cours','promesse de loc','pas de promesse de loc') DEFAULT 'non payer',
  `statut_de_visite` enum('visité','non visité') DEFAULT 'non visité',
  `commentaire` text DEFAULT NULL,
  `created_at` datetime DEFAULT current_timestamp(),
  `rental_type` enum('courte','mensuel','achat') NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Structure de la table `car_comments`
--

CREATE TABLE `car_comments` (
  `id` int(11) NOT NULL,
  `vehicule_id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `content` text DEFAULT NULL,
  `rating` decimal(2,1) DEFAULT NULL CHECK (`rating` between 1 and 5),
  `created_at` datetime DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Structure de la table `car_images`
--

CREATE TABLE `car_images` (
  `id` int(11) NOT NULL,
  `vehicule_id` int(11) NOT NULL,
  `image_url` varchar(255) NOT NULL,
  `uploaded_at` datetime DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `car_images`
--

INSERT INTO `car_images` (`id`, `vehicule_id`, `image_url`, `uploaded_at`) VALUES
(1, 1, 'https://cdn.dahaboo.com/upload/i/2021-03/voiture-a-louer-126347.jpg', '2025-05-22 02:21:43'),
(2, 1, 'https://www.carre-expert-auto.org/photos/expertises/1696_2.jpg', '2025-05-22 02:21:43'),
(3, 1, 'https://cdn.carizy.com/carphotos/8365/wide/renault-clio-occasion-2011-avant-gauche.jpg', '2025-05-22 02:21:43'),
(4, 2, 'https://www.motorlegend.com/occasion-voiture/photos/high/porsche-occasion-109769-1.jpg', '2025-05-22 02:21:43'),
(5, 2, 'http://www.carre-expert-auto.org/photos/expertises/934_1.jpg', '2025-05-22 02:21:43'),
(6, 2, 'https://cdn.carizy.com/carphotos/29135/wide/mercedes-classe-gla-occasion-2016-avant-gauche.jpg', '2025-05-22 02:21:43'),
(7, 3, 'https://cdn.carizy.com/carphotos/35147/wide/peugeot-208-occasion-2013-avant-gauche.jpg', '2025-05-22 02:21:43'),
(8, 3, 'https://cdn.carizy.com/carphotos/12993/wide/peugeot-3008-occasion-2015-avant-gauche.jpg', '2025-05-22 02:21:43'),
(9, 3, 'https://www.carre-expert-auto.org/photos/expertises/1938_1.jpg', '2025-05-22 02:21:43'),
(10, 4, 'http://www.carre-expert-auto.org/photos/expertises/1485_1.jpg', '2025-05-22 02:21:43'),
(11, 4, 'https://cdn.carizy.com/carphotos/11570/wide/toyota-c-hr-occasion-2018-profil-arriere-droit.jpg', '2025-05-22 02:21:43'),
(12, 4, 'https://cfwww.hgregoire.com/photos/by-size/922002/3648x2048/2187836.JPG', '2025-05-22 02:21:43'),
(13, 5, 'https://cdn.carizy.com/carphotos/13425/wide/citroen-c4-occasion-2016-avant-gauche.jpg', '2025-05-22 02:21:43'),
(14, 5, 'https://cdn.carizy.com/carphotos/9216/wide/peugeot-3008-occasion-2010-avant-gauche.jpg', '2025-05-22 02:21:43'),
(15, 5, 'http://www.carre-expert-auto.org/photos/expertises/1118_1.jpg', '2025-05-22 02:21:43'),
(16, 6, 'https://tse2.mm.bing.net/th?id=OIP.rx8ynboehidpnLYGd-Z2PQHaEK&pid=Api&P=0&h=220', '2025-05-22 02:21:43'),
(17, 6, 'http://www.carre-expert-auto.org/photos/expertises/1774_1.jpg', '2025-05-22 02:21:43'),
(18, 6, 'https://www.carre-expert-auto.org/photos/expertises/974_1.jpg', '2025-05-22 02:21:43'),
(19, 7, 'http://www.carre-expert-auto.org/photos/expertises/2090_1.jpg', '2025-05-22 02:21:43'),
(20, 7, 'https://cdn.carizy.com/carphotos/31584/wide/peugeot-207-occasion-2009-avant-gauche.jpg', '2025-05-22 02:21:43'),
(21, 7, 'https://cdn.carizy.com/carphotos/34916/wide/peugeot-308-occasion-2014-avant-gauche.jpg', '2025-05-22 02:21:43'),
(22, 8, 'https://www.carre-expert-auto.org/photos/expertises/1651_1.jpg', '2025-05-22 02:21:43'),
(23, 8, 'https://cdn.carizy.com/carphotos/35069/wide/citroen-c3-occasion-2017-avant-gauche.jpg', '2025-05-22 02:21:43'),
(24, 8, 'https://cdn.carizy.com/carphotos/13425/wide/citroen-c4-occasion-2016-avant-gauche.jpg', '2025-05-22 02:21:43'),
(25, 9, 'https://cdn.carizy.com/carphotos/12993/wide/peugeot-3008-occasion-2015-avant-gauche.jpg', '2025-05-22 02:21:43'),
(26, 9, 'https://cdn.carizy.com/carphotos/11570/wide/toyota-c-hr-occasion-2018-profil-arriere-droit.jpg', '2025-05-22 02:21:43'),
(27, 9, 'http://www.carre-expert-auto.org/photos/expertises/1856_2.jpg', '2025-05-22 02:21:43'),
(28, 10, 'https://cdn.carizy.com/carphotos/9216/wide/peugeot-3008-occasion-2010-avant-gauche.jpg', '2025-05-22 02:21:43'),
(29, 10, 'http://img.sm360.ca/images/inventory/bweb-oto-cremazie/toyota/rav4/2007/5264000/5264000_07037_2007-toyota-rav4_001.jpg', '2025-05-22 02:21:43'),
(30, 10, 'https://www.carre-expert-auto.org/photos/expertises/1919_1.jpg', '2025-05-22 02:21:43'),
(31, 15, 'http://localhost/flexii/uploads/img_682f0508398f6.webp', '2025-05-22 13:05:44'),
(32, 15, 'http://localhost/flexii/uploads/img_682f050839f1e.jpeg', '2025-05-22 13:05:44'),
(33, 15, 'http://localhost/flexii/uploads/img_682f05083a6f5.jpeg', '2025-05-22 13:05:44'),
(34, 15, 'http://localhost/flexii/uploads/img_682f05083a9fb.jpeg', '2025-05-22 13:05:44'),
(35, 16, 'http://localhost/flexii/uploads/img_683071343b622.jpeg', '2025-05-23 14:59:32'),
(36, 16, 'http://localhost/flexii/uploads/img_683071343c12c.webp', '2025-05-23 14:59:32'),
(37, 16, 'http://localhost/flexii/uploads/img_683071343c52d.jpeg', '2025-05-23 14:59:32'),
(38, 16, 'http://localhost/flexii/uploads/img_683071343cb32.webp', '2025-05-23 14:59:32'),
(39, 17, 'http://localhost/flexii/uploads/img_683629fc0dd41.jpg', '2025-05-27 23:09:16'),
(40, 17, 'http://localhost/flexii/uploads/img_683629fc0e108.webp', '2025-05-27 23:09:16'),
(41, 17, 'http://localhost/flexii/uploads/img_683629fc0e57b.webp', '2025-05-27 23:09:16'),
(42, 17, 'http://localhost/flexii/uploads/img_683629fc0e914.webp', '2025-05-27 23:09:16'),
(43, 17, 'http://localhost/flexii/uploads/img_683629fc0ec61.jpg', '2025-05-27 23:09:16'),
(44, 18, 'http://localhost/flexii/uploads/img_6837616183867.webp', '2025-05-28 21:17:53'),
(45, 18, 'http://localhost/flexii/uploads/img_68376161840f5.jpg', '2025-05-28 21:17:53'),
(46, 18, 'http://localhost/flexii/uploads/img_68376161848fc.webp', '2025-05-28 21:17:53'),
(47, 18, 'http://localhost/flexii/uploads/img_683761618505e.webp', '2025-05-28 21:17:53'),
(48, 18, 'http://localhost/flexii/uploads/img_6837616185500.jpg', '2025-05-28 21:17:53'),
(49, 19, 'http://localhost/flexii/uploads/img_684965c9759b4.png', '2025-06-11 13:17:29'),
(50, 19, 'http://localhost/flexii/uploads/img_684965c976288.png', '2025-06-11 13:17:29'),
(51, 19, 'http://localhost/flexii/uploads/img_684965c976b20.png', '2025-06-11 13:17:29'),
(52, 19, 'http://localhost/flexii/uploads/img_684965c977535.png', '2025-06-11 13:17:29'),
(53, 19, 'http://localhost/flexii/uploads/img_684965c977e85.png', '2025-06-11 13:17:29'),
(54, 19, 'http://localhost/flexii/uploads/img_684965c97876e.png', '2025-06-11 13:17:29'),
(55, 20, 'http://localhost/flexii/uploads/img_68496dd0f2729.png', '2025-06-11 13:51:45'),
(56, 20, 'http://localhost/flexii/uploads/img_68496dd0f2b3a.png', '2025-06-11 13:51:45'),
(57, 20, 'http://localhost/flexii/uploads/img_68496dd0f2f67.png', '2025-06-11 13:51:45'),
(58, 20, 'http://localhost/flexii/uploads/img_68496dd0f3149.png', '2025-06-11 13:51:45'),
(59, 20, 'http://localhost/flexii/uploads/img_68496dd0f3326.png', '2025-06-11 13:51:45'),
(60, 20, 'http://localhost/flexii/uploads/img_68496dd0f38f0.png', '2025-06-11 13:51:45'),
(61, 20, 'http://localhost/flexii/uploads/img_68496dd0f3dd7.png', '2025-06-11 13:51:45'),
(62, 20, 'http://localhost/flexii/uploads/img_68496dd100135.png', '2025-06-11 13:51:45'),
(63, 20, 'http://localhost/flexii/uploads/img_68496dd100688.png', '2025-06-11 13:51:45'),
(64, 20, 'http://localhost/flexii/uploads/img_68496dd100b6b.png', '2025-06-11 13:51:45'),
(65, 21, 'http://localhost/flexii/uploads/img_68496f7e8abaa.png', '2025-06-11 13:58:54'),
(66, 21, 'http://localhost/flexii/uploads/img_68496f7e8b35d.png', '2025-06-11 13:58:54'),
(67, 21, 'http://localhost/flexii/uploads/img_68496f7e8b67d.png', '2025-06-11 13:58:54'),
(68, 21, 'http://localhost/flexii/uploads/img_68496f7e8ba79.png', '2025-06-11 13:58:54'),
(69, 21, 'http://localhost/flexii/uploads/img_68496f7e8be65.png', '2025-06-11 13:58:54'),
(70, 21, 'http://localhost/flexii/uploads/img_68496f7e8c66e.png', '2025-06-11 13:58:54'),
(71, 21, 'http://localhost/flexii/uploads/img_68496f7e8ca39.png', '2025-06-11 13:58:54'),
(72, 21, 'http://localhost/flexii/uploads/img_68496f7e8ccbc.png', '2025-06-11 13:58:54'),
(73, 21, 'http://localhost/flexii/uploads/img_68496f7e8cf16.png', '2025-06-11 13:58:54'),
(74, 21, 'http://localhost/flexii/uploads/img_68496f7e8d368.png', '2025-06-11 13:58:54'),
(75, 22, 'http://localhost/flexii/uploads/img_684970edc97f4.png', '2025-06-11 14:05:01'),
(76, 22, 'http://localhost/flexii/uploads/img_684970edca072.png', '2025-06-11 14:05:01'),
(77, 22, 'http://localhost/flexii/uploads/img_684970edca4e8.png', '2025-06-11 14:05:01'),
(78, 22, 'http://localhost/flexii/uploads/img_684970edca932.png', '2025-06-11 14:05:01'),
(79, 22, 'http://localhost/flexii/uploads/img_684970edcabf4.png', '2025-06-11 14:05:01'),
(80, 22, 'http://localhost/flexii/uploads/img_684970edcaf78.png', '2025-06-11 14:05:01'),
(81, 23, 'http://localhost/flexii/uploads/img_684972dfd4abc.png', '2025-06-11 14:13:19'),
(82, 23, 'http://localhost/flexii/uploads/img_684972dfd4f0f.png', '2025-06-11 14:13:19'),
(83, 23, 'http://localhost/flexii/uploads/img_684972dfd5287.png', '2025-06-11 14:13:19'),
(84, 23, 'http://localhost/flexii/uploads/img_684972dfd55b1.png', '2025-06-11 14:13:19'),
(85, 23, 'http://localhost/flexii/uploads/img_684972dfd5998.png', '2025-06-11 14:13:19'),
(86, 23, 'http://localhost/flexii/uploads/img_684972dfd67fc.png', '2025-06-11 14:13:19'),
(87, 23, 'http://localhost/flexii/uploads/img_684972dfd6f2f.png', '2025-06-11 14:13:19'),
(88, 23, 'http://localhost/flexii/uploads/img_684972dfd7721.png', '2025-06-11 14:13:19');

-- --------------------------------------------------------

--
-- Structure de la table `commentaires`
--

CREATE TABLE `commentaires` (
  `id` int(11) NOT NULL,
  `id_ticket` int(11) NOT NULL,
  `id_users` int(11) NOT NULL,
  `commentaire` text NOT NULL,
  `date_creation` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Structure de la table `comments`
--

CREATE TABLE `comments` (
  `id` int(11) NOT NULL,
  `listing_id` int(11) DEFAULT NULL,
  `user_id` int(11) DEFAULT NULL,
  `content` text DEFAULT NULL,
  `rating` decimal(2,1) DEFAULT NULL,
  `created_at` date DEFAULT current_timestamp(),
  `booking_id` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `comments`
--

INSERT INTO `comments` (`id`, `listing_id`, `user_id`, `content`, `rating`, `created_at`, `booking_id`) VALUES
(1, 1, 1, 'incroyable j\'ai bien aimer le voyage rien n\'etait fait ou demander pour nous que voulez vous ', 4.0, '2025-05-02', NULL),
(2, 1, 2, 'hola', 2.0, '2025-04-22', NULL),
(3, 2, 2, 'siii', 2.0, '2025-04-22', NULL),
(4, 2, 3, 'Our mission is to make your life as a streamer easier. Get your branding package now and own on your streaming platform!Secure Payment · PSDs & PNGS included · Top Source for Streamers · HD Templates easier. Get your branding package now and own on your streaming \r\n', 1.0, '2025-04-22', NULL),
(5, 30, 1, 'incroyable j\'ai bien aimer le voyage rien n\'etait fait ou demander pour nous que voulez vous ', 4.0, '2025-05-24', NULL),
(6, 30, 2, 'incroyable jason est trop beau', 2.0, '2025-05-24', NULL),
(7, 1, 13, 'qqqqqqq', 5.0, '2025-05-26', NULL),
(8, 1, 13, 'ddd', 4.0, '2025-05-26', NULL),
(9, 5, 13, 'ffdss', 4.0, '2025-05-26', NULL),
(10, 5, 13, 'dhdh', 1.0, '2025-05-26', NULL),
(11, 6, 13, 'fffffffffff', 1.0, '2025-05-26', NULL),
(12, 6, 13, 'der', 2.0, '2025-05-26', NULL),
(13, 1, 13, 'qqq', 4.0, '2025-05-26', NULL),
(14, 6, 13, 'koko', 1.0, '2025-05-27', NULL),
(15, 1, 13, '<<<<<<', 1.0, '2025-05-27', NULL),
(16, 1, 13, 'ssss', 1.0, '2025-05-27', NULL),
(17, 1, 13, 'ssss', 1.0, '2025-05-27', NULL);

-- --------------------------------------------------------

--
-- Structure de la table `favorites`
--

CREATE TABLE `favorites` (
  `id` int(11) NOT NULL,
  `user_id` int(11) DEFAULT NULL,
  `listing_id` int(11) DEFAULT NULL,
  `created_at` datetime DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `favorites`
--

INSERT INTO `favorites` (`id`, `user_id`, `listing_id`, `created_at`) VALUES
(4, 1, 5, '2025-04-22 18:10:27'),
(8, 1, 8, '2025-04-26 21:58:54'),
(11, 1, 9, '2025-04-27 15:13:46'),
(13, 1, 11, '2025-04-27 16:40:37'),
(14, 1, 1, '2025-04-27 16:55:46'),
(15, 1, 3, '2025-04-28 13:21:09'),
(35, 14, 2, '2025-04-28 17:55:28'),
(36, 14, 3, '2025-04-28 17:55:30'),
(37, 14, 1, '2025-04-28 17:55:33'),
(54, 13, 19, '2025-04-30 16:01:50'),
(55, 13, 20, '2025-04-30 16:01:52'),
(56, 13, 21, '2025-04-30 16:01:53'),
(80, 13, 22, '2025-04-30 16:49:49'),
(84, 13, 1, '2025-04-30 17:03:50'),
(85, 13, 18, '2025-04-30 17:06:17'),
(94, 15, 14, '2025-04-30 17:20:48'),
(95, 15, 15, '2025-04-30 17:39:47'),
(96, 15, 16, '2025-04-30 17:47:00'),
(97, 15, 1, '2025-04-30 17:48:00'),
(98, 15, 2, '2025-04-30 17:48:03'),
(104, 13, 17, '2025-04-30 17:51:31'),
(108, 15, 17, '2025-05-01 12:33:33'),
(111, 13, 16, '2025-05-07 10:41:01'),
(112, 16, 13, '2025-05-07 12:11:14'),
(113, 16, 1, '2025-05-07 12:42:13'),
(114, 13, 23, '2025-05-22 03:07:55'),
(117, 13, 29, '2025-05-28 14:08:22');

-- --------------------------------------------------------

--
-- Structure de la table `favorite_cars`
--

CREATE TABLE `favorite_cars` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `vehicule_id` int(11) NOT NULL,
  `created_at` datetime DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Structure de la table `hosts`
--

CREATE TABLE `hosts` (
  `id` int(11) NOT NULL,
  `name` varchar(255) DEFAULT NULL,
  `email` varchar(255) DEFAULT NULL,
  `password` varchar(255) DEFAULT NULL,
  `avatar_url` varchar(255) DEFAULT NULL,
  `birth_year` int(11) DEFAULT NULL,
  `profession` varchar(255) DEFAULT NULL,
  `total_reviews` int(11) DEFAULT NULL,
  `rating` float DEFAULT NULL,
  `years_as_host` int(11) DEFAULT NULL,
  `superhost` tinyint(1) DEFAULT NULL,
  `host_type` enum('logement','vehicule','mixte') DEFAULT 'logement',
  `statut` enum('en_attente','valide','refuse') DEFAULT 'en_attente',
  `identity_url` varchar(255) DEFAULT NULL,
  `description` text DEFAULT NULL,
  `motif` text DEFAULT NULL,
  `account_statut` enum('active','desactive') DEFAULT 'active'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `hosts`
--

INSERT INTO `hosts` (`id`, `name`, `email`, `password`, `avatar_url`, `birth_year`, `profession`, `total_reviews`, `rating`, `years_as_host`, `superhost`, `host_type`, `statut`, `identity_url`, `description`, `motif`, `account_statut`) VALUES
(1, 'Geoffrey', 'md@gmail.com', '$2y$10$YVE5ZLRLKE//Nyb59KMzY.C8dXm1k2B28eN/qvGy7lA8l3DPu7F1.', 'uploads/68476dac7b49e_avatar.png', 2004, 'joueurss', 391, 4.78, 7, 1, 'logement', 'valide', 'uploads/684745e0a6def_identity.png', 'moi c geoffrey', '', 'active'),
(2, 'Sophie', NULL, NULL, 'https://i.pinimg.com/originals/bb/ff/6f/bbff6f926cabe325994e828d13140157.jpg', 1990, 'Chef cuisinière', 214, 4.85, 5, 1, 'logement', 'en_attente', NULL, NULL, NULL, 'active'),
(3, 'Lucas', NULL, NULL, 'https://i.pinimg.com/originals/bb/ff/6f/bbff6f926cabe325994e828d13140157.jpg', 1985, 'Photographe', 102, 4.6, 3, 0, 'logement', 'en_attente', NULL, NULL, NULL, 'active'),
(4, 'jm', 'ja.mampouya@gmail.com', '$2y$10$pAOMPNFL8RGHkJBxkiDCgO2E0OULPvqbg4nQIK9j9ldyek6VUnUke', 'https://i.pinimg.com/originals/bb/ff/6f/bbff6f926cabe325994e828d13140157.jpg', 2000, 'joueur', 0, 0, 0, 0, 'logement', 'en_attente', 'uploads/682e76a387e8e_44.png', 'moi c jay', NULL, 'active'),
(5, 'klo', 'm@gmail.com', '$2y$10$Kyq0a9pq1gjHepp7EWHM1uLkgCslH6nPkL4Zw.S7XGP81w51tvyUq', 'uploads/682e7790e5c0c_45.png', 2001, 'ministre', 0, 0, 0, 0, 'logement', 'en_attente', 'uploads/682e7790e614f_45.png', 'bah c moi', NULL, 'active'),
(6, 'klo', 'mh@gmail.com', '$2y$10$ZElEQzER5JSxYaqU4lc.LOJifHCrK5Vw0WNfsMFbV7Wy1Bu4AmLqu', 'uploads/682e7839b5b2c_45.png', 2001, 'ministre', 0, 0, 0, 0, 'logement', 'en_attente', 'uploads/682e7839b5ff0_45.png', 'bah c moikk', NULL, 'active'),
(7, 'jm boss', 'j@gmail.com', '$2y$10$yeQtLGLsIgFrDc71J6FtXOrybkhTsJhO3q2aFfw02HcgQtKIH08tC', 'uploads/682f1bab98741_GetMedia.ashx_-2.jpeg', 1988, 'docteur', 0, 0, 0, 0, 'vehicule', 'en_attente', 'uploads/682f1bab98e54_GetMedia-2019-11-29T101606.910.jpeg', 'qui moi ?', NULL, 'active'),
(8, 'ssssss', 'jass.mampouya@gmail.com', '$2y$10$5vTVvokTvQ2EoZrmhcy5VeZ6TjMPGLGYTYoiTxiY2Ezz17DjNQM2.', 'flexii/flexii/ap/api/uploads/6835fe4ab0e96_maison-corail.webp', 1902, 'sxx', 0, 0, 0, 0, 'logement', 'en_attente', 'uploads/6835fe4ab1661_GetMedia.ashx_-2.jpeg', 'sskks', NULL, 'active'),
(9, 'sss', 'jason.mampouya@ginov.io', '$2y$10$pa/9OeSV0yatlrniVxSKoe4ocyUtgOO2LAVeQLfJz9QQT7lTGYx42', 'uploads/6835fff67f1df_homme.jpg', 2005, 'ss', 1, 0, 15, 1, 'vehicule', 'en_attente', 'uploads/6835fff67f788_GetMedia.ashx_-2.jpeg', 'xcvv', NULL, 'active'),
(10, 'dd', 'jad.mampouya@gmail.com', '$2y$10$lJWzr5Ty.F/4hepy2gizROfmilYWdWMBsXbzM/TRQA5aLKfdq3sey', 'uploads/683815594ec8c_2023-Mercedes-Benz-A-Class-Hatch-Sedan-2.jpg', 2022, 'dd', 0, 0, 0, 0, 'logement', 'en_attente', 'uploads/683815594f799_2023-Mercedes-Benz-A-Class-Hatch-Sedan-2.jpg', 'dd', NULL, 'active'),
(11, 'ss', 'ms@gmail.com', '$2y$10$ZsjXWIWJo65dK4KM3rAwp.1NAkDfGrqKq6U2YW2N0/2Uw0r1wmsQO', 'uploads/683815a8dc9a8_homme.jpg', 2012, 'ss', 0, 0, 0, 0, 'logement', 'en_attente', 'uploads/683815a8dcf19_2023-Mercedes-Benz-A-Class-Hatch-Sedan-2.jpg', 'ss', NULL, 'active'),
(12, 'iui', 'mdq@gmail.com', '$2y$10$OQ9VFGdsP7wWRnCZyQFjQuYmKTmWLCT.4cxCXP18tJR05oJ9uWg7m', 'uploads/68381e00df0d2_homme.jpg', 2000, 'gsf', 0, 0, 0, 0, 'logement', 'en_attente', 'uploads/68381e00df53a_profile.png', 'moi c jason', NULL, 'active');

-- --------------------------------------------------------

--
-- Structure de la table `listings`
--

CREATE TABLE `listings` (
  `id` int(11) NOT NULL,
  `user_id` int(11) DEFAULT NULL,
  `title` varchar(255) DEFAULT NULL,
  `description` text DEFAULT NULL,
  `address` varchar(255) DEFAULT NULL,
  `city` varchar(100) DEFAULT NULL,
  `country` varchar(100) DEFAULT NULL,
  `price_per_night` int(11) DEFAULT NULL,
  `max_guests` int(11) DEFAULT NULL,
  `num_bedrooms` int(11) DEFAULT NULL,
  `num_bathrooms` int(11) DEFAULT NULL,
  `statut` enum('en_attente','valide','refuse') DEFAULT 'en_attente',
  `posted_statut` enum('actif','inactif') DEFAULT 'actif',
  `has_living_room` tinyint(1) DEFAULT 0,
  `is_furnished` tinyint(1) DEFAULT 0,
  `has_garden` tinyint(1) DEFAULT 0,
  `has_balcony` tinyint(1) DEFAULT 0,
  `has_terrace` tinyint(1) DEFAULT 0,
  `has_pool` tinyint(1) DEFAULT 0,
  `rental_type` enum('mensuel','courte','achat') DEFAULT 'mensuel',
  `has_wifi` tinyint(1) DEFAULT 0,
  `has_parking` tinyint(1) DEFAULT 0,
  `has_kitchen` tinyint(1) DEFAULT 0,
  `created_at` datetime DEFAULT current_timestamp(),
  `host_id` int(11) DEFAULT NULL,
  `latitude` decimal(10,8) DEFAULT NULL,
  `longitude` decimal(11,8) DEFAULT NULL,
  `motif` varchar(255) DEFAULT NULL,
  `price_per_month` int(11) NOT NULL DEFAULT 0,
  `listing_type` enum('Maison','Appartement','Grange','Chambre d''hôtes','Bateau','Cabane','Caravane ou camping-car','Casa particular','Château','Maison troglodyte','Conteneur maritime','Maison cycladique') DEFAULT NULL,
  `occupation_type` enum('Un logement entier','Une chambre') DEFAULT NULL,
  `price_for_sale` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `listings`
--

INSERT INTO `listings` (`id`, `user_id`, `title`, `description`, `address`, `city`, `country`, `price_per_night`, `max_guests`, `num_bedrooms`, `num_bathrooms`, `statut`, `posted_statut`, `has_living_room`, `is_furnished`, `has_garden`, `has_balcony`, `has_terrace`, `has_pool`, `rental_type`, `has_wifi`, `has_parking`, `has_kitchen`, `created_at`, `host_id`, `latitude`, `longitude`, `motif`, `price_per_month`, `listing_type`, `occupation_type`, `price_for_sale`) VALUES
(1, 1, 'Appartement de luxe à Dubai', 'À propos de ce logement\nEvadez-vous dans une maison moderne avec rooftop lors de votre séjour à Paris !\nProfitez du confort et du calme d\'une maison toute équipée à moins de 20 minutes du coeur de Paris.\nIdéal pour les familles avec tout l\'équipement nécessaire pour bébés.\nLe logement\nMaison sur 2 étages avec 2 chambres (lit queen size et lit double) et une chambre supplémentaire pour bébé\n\nPour profiter 2 espaces extérieurs dont un rooftop !\nAutres remarques\nLes fêtes et événements ne sont pas autorisés.\nNuméro d\'enregistrement\n9300600020020', 'siafoumou', 'Pointe-noire', 'congo', 16404, 2, 1, 1, 'valide', 'actif', 1, 1, 1, 1, 1, 1, 'courte', 1, 1, 1, '2025-04-22 15:46:09', 1, -4.71840000, 11.86199000, NULL, 0, NULL, NULL, 0),
(2, 2, 'Maison romantique à Rome', 'Parfait pour les couples', '45 Via Roma', 'Rome', 'Italy', 3784, 2, 1, 1, 'en_attente', 'actif', 0, 0, 0, 0, 0, 0, 'courte', 1, 1, 1, '2025-04-22 15:46:09', 1, -4.71840000, 11.86199000, NULL, 0, NULL, NULL, 0),
(3, 3, 'Villa en pleine jungle à Ubud', 'Vue imprenable et calme assuré', 'Bali Green Road', 'Ubud', 'Indonesia', 5490, 4, 2, 2, 'en_attente', 'actif', 0, 0, 0, 0, 0, 0, 'courte', 1, 1, 1, '2025-04-22 15:46:09', 2, -6.71840000, 13.86199000, NULL, 0, NULL, NULL, 0),
(4, 4, 'Maison typique irlandaise', 'Ambiance chaleureuse à Dublin', '7 Green Lane', 'Dublin', 'Ireland', 11788, 3, 2, 2, 'en_attente', 'actif', 0, 0, 0, 0, 0, 0, 'mensuel', 1, 0, 1, '2025-04-22 15:46:09', NULL, NULL, NULL, NULL, 0, NULL, NULL, 0),
(5, 5, 'Cabane dans la jungle malaise', 'Expérience immersive en nature', 'Jalan Hulu', 'Hulu Langat', 'Malaysia', 37298, 4, 2, 1, 'en_attente', 'actif', 0, 0, 0, 0, 0, 0, 'mensuel', 0, 0, 1, '2025-04-22 15:46:09', NULL, NULL, NULL, NULL, 0, NULL, NULL, 0),
(6, 6, 'Maison balnéaire aux Philippines', 'Vue sur mer et plage privée', 'Cebu Coast', 'Balamban', 'Philippines', 24334, 6, 3, 2, 'en_attente', 'actif', 0, 0, 0, 0, 0, 0, 'courte', 1, 1, 1, '2025-04-22 15:46:09', NULL, NULL, NULL, NULL, 0, NULL, NULL, 0),
(7, 7, 'Cottage scandinave au Danemark', 'Design épuré et nature', 'Nordvej 12', 'Stege', 'Denmark', 19764, 3, 2, 1, 'en_attente', 'actif', 0, 0, 0, 0, 0, 0, 'courte', 1, 0, 1, '2025-04-22 15:46:09', NULL, NULL, NULL, NULL, 0, NULL, NULL, 0),
(8, 8, 'Maison tropicale en Thaïlande', 'Repos et cocotiers', 'Surin Beach Road', 'Thung Sumo', 'Thailand', 16404, 4, 2, 1, 'en_attente', 'actif', 0, 0, 0, 0, 0, 0, 'mensuel', 1, 1, 1, '2025-04-22 15:46:09', NULL, NULL, NULL, NULL, 0, NULL, NULL, 0),
(9, 9, 'Maison troglodyte en Turquie', 'Charme historique et confort moderne', 'Cappadocia Hill', 'Ortahisar', 'Turkey', 5664, 2, 1, 1, 'en_attente', 'actif', 0, 0, 0, 0, 0, 0, 'courte', 1, 0, 1, '2025-04-22 15:46:09', NULL, NULL, NULL, NULL, 0, NULL, NULL, 0),
(10, 10, 'Chalet norvégien à Vradal', 'Hiver féérique et feu de bois', 'Mountain Lane', 'Vradal', 'Norway', 66404, 6, 3, 2, 'en_attente', 'actif', 0, 0, 0, 0, 0, 0, 'courte', 1, 1, 1, '2025-04-22 15:46:09', NULL, NULL, NULL, NULL, 0, NULL, NULL, 0),
(11, 11, 'Maison verte en Inde', 'Maison autonome en énergie', 'Eco Street 5', 'Koleri', 'India', 1994, 3, 2, 1, 'en_attente', 'actif', 0, 0, 0, 0, 0, 0, 'mensuel', 1, 0, 1, '2025-04-22 15:46:09', NULL, NULL, NULL, NULL, 0, NULL, NULL, 0),
(12, 12, 'Maison de plage en Égypte', 'Soleil, sable et silence', 'Red Sea Bay', 'Dahab', 'Egypt', 8764, 4, 2, 2, 'en_attente', 'actif', 0, 0, 0, 0, 0, 0, 'mensuel', 1, 1, 1, '2025-04-22 15:46:09', NULL, NULL, NULL, NULL, 0, NULL, NULL, 0),
(13, 1, 'Villa Prestige à Poto-Poto', 'Maison moderne avec piscine privée au coeur de Poto-Poto, idéale pour les séjours familiaux.', 'Rue du Commandant Makosso', 'Brazzaville', 'Congo', 25000, 6, 3, 2, 'en_attente', 'actif', 0, 0, 0, 0, 0, 0, 'mensuel', 1, 1, 1, '2025-04-28 22:10:46', 1, -4.26336000, 15.27193000, NULL, 0, NULL, NULL, 0),
(14, 2, 'Appartement cosy à Moungali', 'Appartement neuf avec balcon et vue dégagée sur Brazzaville.', 'Avenue de l’OUA', 'Brazzaville', 'Congo', 18000, 2, 1, 1, 'en_attente', 'actif', 0, 0, 1, 0, 0, 0, 'mensuel', 1, 0, 1, '2025-04-28 22:10:46', 2, -4.24701000, 15.27378000, NULL, 0, NULL, NULL, 0),
(15, 3, 'Loft moderne à Bacongo', 'Grand loft lumineux proche du fleuve Congo. Quartier vivant et sécurisé.', 'Boulevard Denis Sassou Nguesso', 'Brazzaville', 'Congo', 30000, 4, 2, 2, 'en_attente', 'actif', 0, 0, 0, 0, 0, 0, 'mensuel', 1, 1, 1, '2025-04-28 22:10:46', 3, -4.29758000, 15.27778000, NULL, 0, NULL, NULL, 0),
(16, 4, 'Maison familiale à Mfilou', 'Maison spacieuse, jardin privé et parking. Parfait pour de longs séjours.', 'Route de Kintélé', 'Brazzaville', 'Congo', 22000, 5, 3, 2, 'en_attente', 'actif', 0, 0, 0, 0, 0, 0, 'mensuel', 1, 1, 1, '2025-04-28 22:10:46', 4, -4.34908000, 15.32561000, NULL, 0, NULL, NULL, 0),
(17, 5, 'Studio chic à Diata', 'Studio rénové en plein centre du quartier Diata. Internet haut débit.', 'Avenue Matsoua', 'Brazzaville', 'Congo', 12000, 2, 1, 1, 'en_attente', 'actif', 0, 0, 0, 0, 0, 0, 'mensuel', 1, 0, 1, '2025-04-28 22:10:46', 5, -4.28750000, 15.26639000, NULL, 0, NULL, NULL, 0),
(18, 6, 'Villa luxueuse à Côte Sauvage', 'Villa face à l’océan Atlantique, piscine, accès direct à la plage.', 'Corniche de Pointe-Noire', 'Pointe-Noire', 'Congo', 40000, 8, 4, 3, 'en_attente', 'actif', 0, 0, 0, 0, 0, 0, 'mensuel', 1, 1, 1, '2025-04-28 22:10:46', 6, -4.79252000, 11.84732000, NULL, 0, NULL, NULL, 0),
(19, 7, 'Appartement vue mer à Ngoyo', 'Appartement haut de gamme à 5 minutes de la plage de Ngoyo.', 'Avenue Ngoyo', 'Pointe-Noire', 'Congo', 28000, 3, 2, 2, 'en_attente', 'actif', 0, 0, 0, 0, 0, 0, 'mensuel', 1, 1, 1, '2025-04-28 22:10:46', 7, -4.77380000, 11.82720000, NULL, 0, NULL, NULL, 0),
(20, 8, 'Maison contemporaine à Loandjili', 'Design moderne et prestations haut standing. Parking privé.', 'Boulevard Charles de Gaulle', 'Pointe-Noire', 'Congo', 35000, 6, 3, 2, 'en_attente', 'actif', 0, 0, 0, 0, 0, 0, 'mensuel', 1, 1, 1, '2025-04-28 22:10:46', 8, -4.79149000, 11.87050000, NULL, 0, NULL, NULL, 0),
(21, 9, 'Résidence paisible à Tié-Tié', 'Petite villa tranquille avec jardin, idéale pour familles.', 'Avenue de Tié-Tié', 'Pointe-Noire', 'Congo', 18000, 4, 2, 1, 'en_attente', 'actif', 0, 0, 0, 0, 0, 0, 'mensuel', 1, 0, 1, '2025-04-28 22:10:46', 9, -4.77730000, 11.86360000, NULL, 0, NULL, NULL, 0),
(22, 10, 'Maison bord de mer à Songolo', 'Superbe maison pieds dans l’eau dans le quartier Songolo.', 'Route Songolo-Plage', 'Pointe-Noire', 'Congo', 37000, 6, 3, 2, 'en_attente', 'actif', 0, 0, 0, 0, 0, 0, 'mensuel', 1, 1, 1, '2025-04-28 22:10:46', 10, -4.75940000, 11.82200000, NULL, 0, NULL, NULL, 0),
(23, NULL, 'Maison', 'Ajoutez une description personnalisée', 'Poto-Poto', 'Brazzaville', 'Congo', 45666, 1, 2, 1, 'en_attente', 'actif', 0, 0, 0, 0, 0, 0, 'courte', 1, 1, 1, '2025-05-22 03:07:41', NULL, NULL, NULL, NULL, 0, NULL, NULL, 0),
(24, NULL, 'Maison', 'Ajoutez une description personnalisée', 'Makélékélé', 'Brazzaville', 'Congo', 445, 2, 1, 1, 'en_attente', 'actif', 0, 0, 0, 0, 0, 0, 'courte', 0, 0, 1, '2025-05-23 13:21:49', NULL, NULL, NULL, NULL, 0, NULL, NULL, 0),
(25, NULL, 'Maison', 'Ajoutez une description personnalisée', 'Bacongo', 'Brazzaville', 'Congo', 8999, 2, 1, 1, 'en_attente', 'actif', 0, 0, 0, 0, 0, 0, 'courte', 1, 1, 1, '2025-05-23 14:48:33', NULL, NULL, NULL, NULL, 0, NULL, NULL, 0),
(26, NULL, 'Maison', 'Ajoutez une description personnalisée', 'Mvoumvou', 'Pointe-Noire', 'Congo', 456, 1, 1, 1, 'en_attente', 'actif', 0, 0, 0, 0, 0, 0, '', 1, 0, 1, '2025-05-23 15:34:46', NULL, NULL, NULL, NULL, 0, NULL, NULL, 0),
(27, NULL, 'Maison', 'Ajoutez une description personnalisée', 'sl', 'Brazzaville', 'Congo', 4565666, 1, 1, 1, 'en_attente', 'actif', 0, 0, 0, 0, 0, 0, '', 1, 0, 1, '2025-05-23 16:40:50', NULL, NULL, NULL, NULL, 0, NULL, NULL, 0),
(28, NULL, 'Maison', 'Ajoutez une description personnalisée', 'Poto-Poto', 'Brazzaville', 'Congo', 45599, 1, 1, 1, 'en_attente', 'actif', 0, 0, 0, 0, 0, 0, '', 1, 1, 1, '2025-05-23 16:53:04', 1, NULL, NULL, NULL, 0, NULL, NULL, 0),
(29, NULL, 'ouiiii', 'zuiiiiiii', 'Poto-Poto', 'Pointe-Noire', 'Congo', 100000, 1, 1, 1, 'en_attente', 'actif', 0, 0, 0, 0, 0, 0, '', 1, 1, 1, '2025-05-23 17:04:20', 1, NULL, NULL, NULL, 0, NULL, NULL, 0),
(30, NULL, 'test2', 'quoi', 'Ngoyo', 'Pointe-Noire', 'Congo', 4566, 1, 1, 1, 'en_attente', 'actif', 0, 0, 0, 0, 0, 0, '', 1, 1, 1, '2025-05-23 22:32:12', 1, NULL, NULL, NULL, 0, NULL, NULL, 0),
(31, NULL, 'test56', 'Formation : Génération d’Image + Formation : Montage Vidéo', 'moko', 'Brazzaville', 'Congo', 7898, 1, 1, 1, 'en_attente', 'actif', 0, 0, 0, 0, 0, 0, '', 1, 1, 1, '2025-05-24 12:25:01', 1, NULL, NULL, NULL, 0, NULL, NULL, 0),
(32, NULL, 'mmmmmmmmm', 'mmmmmmmmmmmmmm', 'Poto-Poto', 'Brazzaville', 'Congo', 5544, 1, 1, 1, 'en_attente', 'actif', 0, 0, 0, 0, 0, 0, '', 1, 1, 1, '2025-05-25 23:55:53', NULL, NULL, NULL, NULL, 0, NULL, NULL, 0),
(33, NULL, 'test2302', 'oui oui', 'Bacongo', 'Brazzaville', 'Congo', 122, 1, 1, 1, 'en_attente', 'actif', 0, 0, 0, 0, 0, 0, '', 1, 1, 1, '2025-05-27 23:02:53', NULL, NULL, NULL, NULL, 0, NULL, NULL, 0),
(34, NULL, 'hhl', 'decouvrer notre maison', 'Makélékélé', 'Brazzaville', 'Congo', 45, 1, 1, 1, 'en_attente', 'actif', 0, 0, 0, 0, 0, 0, '', 1, 1, 1, '2025-06-11 13:13:56', NULL, NULL, NULL, NULL, 0, NULL, NULL, 0),
(35, NULL, 'sdds', 'ddsd', 'Bacongo', 'Brazzaville', 'Congo', NULL, 1, 1, 1, 'en_attente', 'actif', 0, 0, 0, 0, 0, 0, '', 1, 0, 0, '2025-06-11 16:59:48', NULL, NULL, NULL, NULL, 0, 'Maison', NULL, 500),
(36, NULL, 'xx', 'vbvvb', 'Moungali', 'Brazzaville', 'Congo', 4556, 1, 1, 1, 'en_attente', 'actif', 1, 0, 1, 1, 1, 1, '', 1, 1, 1, '2025-06-11 17:02:08', NULL, NULL, NULL, NULL, 0, 'Appartement', NULL, NULL),
(37, NULL, 'ddddddddddddddd', 'bv', 'Ouenzé', 'Brazzaville', 'Congo', NULL, 1, 1, 1, 'en_attente', 'actif', 1, 0, 0, 0, 0, 0, '', 1, 1, 1, '2025-06-11 17:04:05', NULL, NULL, NULL, NULL, 45566, 'Cabane', NULL, NULL),
(38, NULL, 'xx', 'vvbb', 'hh', 'Pointe-Noire', 'Congo', NULL, 1, 1, 1, 'en_attente', 'actif', 1, 0, 1, 1, 0, 1, '', 1, 1, 1, '2025-06-11 17:21:38', NULL, NULL, NULL, NULL, 0, 'Maison', NULL, NULL),
(39, NULL, 'dcdd', 'ccccx', 'Bacongo', 'Brazzaville', 'Congo', NULL, 1, 1, 1, 'en_attente', 'actif', 1, 0, 0, 0, 0, 0, 'mensuel', 1, 1, 1, '2025-06-11 17:23:44', NULL, NULL, NULL, NULL, 45555, 'Appartement', NULL, NULL),
(40, NULL, 'cx', 'wwwx', 'ccc', 'Pointe-Noire', 'Congo', NULL, 1, 1, 1, 'en_attente', 'actif', 1, 0, 0, 0, 0, 0, 'achat', 0, 0, 1, '2025-06-11 17:25:45', NULL, NULL, NULL, NULL, 0, 'Maison', NULL, 7899),
(41, NULL, 'cbbc', 'x,xko', 'Mongo-Mpoukou', 'Pointe-Noire', 'Congo', 10000, 1, 1, 1, 'en_attente', 'actif', 1, 0, 0, 0, 0, 0, 'courte', 1, 1, 1, '2025-06-11 17:27:21', NULL, NULL, NULL, NULL, 0, 'Bateau', NULL, NULL),
(42, NULL, 'vma', 'vwa', 'Madibou', 'Brazzaville', 'Congo', NULL, 1, 1, 1, 'en_attente', 'actif', 0, 0, 0, 0, 0, 0, 'mensuel', 1, 1, 1, '2025-06-11 17:41:21', NULL, NULL, NULL, NULL, 554, 'Appartement', NULL, NULL),
(43, NULL, 'test3', 'kk', 'mvouvou', 'Brazzaville', 'Congo', NULL, 1, 1, 1, 'en_attente', 'actif', 1, 0, 1, 1, 1, 1, 'achat', 1, 1, 1, '2025-06-13 16:40:18', NULL, NULL, NULL, NULL, 0, 'Maison', NULL, 45666);

-- --------------------------------------------------------

--
-- Structure de la table `listing_images`
--

CREATE TABLE `listing_images` (
  `id` int(11) NOT NULL,
  `listing_id` int(11) DEFAULT NULL,
  `image_url` varchar(255) DEFAULT NULL,
  `uploaded_at` datetime DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `listing_images`
--

INSERT INTO `listing_images` (`id`, `listing_id`, `image_url`, `uploaded_at`) VALUES
(52, 2, 'https://lebaneseexaminer.com/wp-content/uploads/2018/04/dubai-property-1.jpg', '2025-04-22 16:42:54'),
(53, 2, 'https://luxury-houses.net/wp-content/uploads/2020/12/Design-Concept-of-the-Most-Outstanding-Mansion-in-Dubai-4.jpg', '2025-04-22 16:42:54'),
(54, 2, 'https://luxury-houses.net/wp-content/uploads/2020/03/Mediterranean-Style-Mansion-in-Dubai-8.jpg', '2025-04-22 16:42:54'),
(55, 3, 'https://a0.muscache.com/im/pictures/956e582b-a93a-4419-85eb-fd0ed86ed4d0.jpg?im_w=720', '2025-04-22 16:42:54'),
(56, 3, 'https://a0.muscache.com/im/pictures/96d16fdf-f5f9-4711-a6de-5f457de69716.jpg?im_w=720', '2025-04-22 16:42:54'),
(57, 3, 'https://congo-zone.com/wp-content/uploads/2022/01/appartement-meuble-congo-brazzaville-matour-3122-1.jpg', '2025-04-22 16:42:54'),
(58, 4, 'https://1.bp.blogspot.com/-36mTHWNX6bM/YP6dJwhNQtI/AAAAAAAAA68/pvV1mMErxHkYIHgqkoX4Qv_DUcBL-uUjwCLcBGAsYHQ/s2048/best-luxury-properties-vastgoed-in-dubai-damac-hills-2-03.jpg', '2025-04-22 16:42:54'),
(59, 4, 'https://img.jamesedition.com/listing_images/2019/11/01/15/08/51/ce24db5f-3352-488c-b66a-52bef962cdbe/je/2000xxs.jpg', '2025-04-22 16:42:54'),
(60, 4, 'https://luxhabitat.ae/resizedimages/1440w/article/546/source/8136985e7708b332a1574a8fe940ce800d6a329ac432785ad6dfa0639abf3551.jpg', '2025-04-22 16:42:54'),
(61, 5, 'https://do84cgvgcm805.cloudfront.net/article/636/1200/8f4c0e8fa1f3b35d39de9db2f185b0a2a0ffff404c2b4d3fcddd81ddaba17069.jpg', '2025-04-22 16:42:54'),
(62, 5, 'https://lebaneseexaminer.com/wp-content/uploads/2018/04/dubai-property-1.jpg', '2025-04-22 16:42:54'),
(63, 5, 'https://luxury-houses.net/wp-content/uploads/2020/12/Design-Concept-of-the-Most-Outstanding-Mansion-in-Dubai-4.jpg', '2025-04-22 16:42:54'),
(64, 6, 'https://luxury-houses.net/wp-content/uploads/2020/03/Mediterranean-Style-Mansion-in-Dubai-8.jpg', '2025-04-22 16:42:54'),
(65, 6, 'https://do84cgvgcm805.cloudfront.net/article/546/1200/8136985e7708b332a1574a8fe940ce800d6a329ac432785ad6dfa0639abf3551.jpg', '2025-04-22 16:42:54'),
(66, 6, 'https://tse2.mm.bing.net/th?id=OIP.Mrz7bk1NuvdXu3zTEN5EYQHaEK&pid=Api&P=0&h=180', '2025-04-22 16:42:54'),
(67, 7, 'http://static1.mansionglobal.com/production/media/article-images/1149b2570c3c74f1b928a9de2b54beff/large_DUBAI_EXTERIOR.jpeg', '2025-04-22 16:42:54'),
(68, 7, 'https://1.bp.blogspot.com/-36mTHWNX6bM/YP6dJwhNQtI/AAAAAAAAA68/pvV1mMErxHkYIHgqkoX4Qv_DUcBL-uUjwCLcBGAsYHQ/s2048/best-luxury-properties-vastgoed-in-dubai-damac-hills-2-03.jpg', '2025-04-22 16:42:54'),
(69, 7, 'https://img.jamesedition.com/listing_images/2019/11/01/15/08/51/ce24db5f-3352-488c-b66a-52bef962cdbe/je/2000xxs.jpg', '2025-04-22 16:42:54'),
(70, 8, 'https://luxhabitat.ae/resizedimages/1440w/article/546/source/8136985e7708b332a1574a8fe940ce800d6a329ac432785ad6dfa0639abf3551.jpg', '2025-04-22 16:42:54'),
(71, 8, 'https://do84cgvgcm805.cloudfront.net/article/636/1200/8f4c0e8fa1f3b35d39de9db2f185b0a2a0ffff404c2b4d3fcddd81ddaba17069.jpg', '2025-04-22 16:42:54'),
(72, 8, 'https://lebaneseexaminer.com/wp-content/uploads/2018/04/dubai-property-1.jpg', '2025-04-22 16:42:54'),
(73, 9, 'https://luxury-houses.net/wp-content/uploads/2020/12/Design-Concept-of-the-Most-Outstanding-Mansion-in-Dubai-4.jpg', '2025-04-22 16:42:54'),
(74, 9, 'https://luxury-houses.net/wp-content/uploads/2020/03/Mediterranean-Style-Mansion-in-Dubai-8.jpg', '2025-04-22 16:42:54'),
(75, 9, 'https://do84cgvgcm805.cloudfront.net/article/546/1200/8136985e7708b332a1574a8fe940ce800d6a329ac432785ad6dfa0639abf3551.jpg', '2025-04-22 16:42:54'),
(76, 10, 'https://tse2.mm.bing.net/th?id=OIP.Mrz7bk1NuvdXu3zTEN5EYQHaEK&pid=Api&P=0&h=180', '2025-04-22 16:42:54'),
(77, 10, 'http://static1.mansionglobal.com/production/media/article-images/1149b2570c3c74f1b928a9de2b54beff/large_DUBAI_EXTERIOR.jpeg', '2025-04-22 16:42:54'),
(78, 10, 'https://1.bp.blogspot.com/-36mTHWNX6bM/YP6dJwhNQtI/AAAAAAAAA68/pvV1mMErxHkYIHgqkoX4Qv_DUcBL-uUjwCLcBGAsYHQ/s2048/best-luxury-properties-vastgoed-in-dubai-damac-hills-2-03.jpg', '2025-04-22 16:42:54'),
(79, 11, 'https://img.jamesedition.com/listing_images/2019/11/01/15/08/51/ce24db5f-3352-488c-b66a-52bef962cdbe/je/2000xxs.jpg', '2025-04-22 16:42:54'),
(80, 11, 'https://lebaneseexaminer.com/wp-content/uploads/2018/04/dubai-property-1.jpg', '2025-04-22 16:42:54'),
(81, 11, 'https://luxury-houses.net/wp-content/uploads/2020/12/Design-Concept-of-the-Most-Outstanding-Mansion-in-Dubai-4.jpg', '2025-04-22 16:42:54'),
(82, 12, 'https://luxury-houses.net/wp-content/uploads/2020/03/Mediterranean-Style-Mansion-in-Dubai-8.jpg', '2025-04-22 16:42:54'),
(83, 12, 'https://do84cgvgcm805.cloudfront.net/article/546/1200/8136985e7708b332a1574a8fe940ce800d6a329ac432785ad6dfa0639abf3551.jpg', '2025-04-22 16:42:54'),
(84, 12, 'http://static1.mansionglobal.com/production/media/article-images/1149b2570c3c74f1b928a9de2b54beff/large_DUBAI_EXTERIOR.jpeg', '2025-04-22 16:42:54'),
(85, 13, 'http://img.gentside.com/article/villa/la-villa-du-528-lakeview-ct-a-miami_1850b75fca87b6517d6846413ae04f9f03cc4e01.jpg', '2025-04-28 22:13:52'),
(86, 13, 'https://ofcoursemiami.fr/wp-content/uploads/2019/11/Villa-de-tres-grand-luxe-Miami.jpg', '2025-04-28 22:13:52'),
(87, 13, 'https://www.maison-miami.com/wp-content/uploads/2016/07/vente-villa-luxe.jpg', '2025-04-28 22:13:52'),
(88, 14, 'https://realty-luxe.com/wp-content/uploads/2019/03/Se-loger-usa-hres.jpg', '2025-04-28 22:13:52'),
(89, 14, 'https://luxury-houses.net/wp-content/uploads/2020/07/Ultra-luxury-Home-in-Miami-Beach-has-just-completed-2.jpg', '2025-04-28 22:13:52'),
(90, 14, 'https://thegoodlife.fr/wp-content/uploads/sites/2/2019/03/numerisation-tgl-miami-zooms-proprietes-insert-1-ewm-realty-international.jpg', '2025-04-28 22:13:52'),
(91, 15, 'https://static3.mansionglobal.com/production/media/article-images/72bc5394f4608d6785a953899233c16a/large_xlarge_f2886c10-6197-4c52-9d83-704b17c05642.jpg', '2025-04-28 22:13:52'),
(92, 15, 'https://realty-luxe.com/wp-content/uploads/2019/04/Maison-Miami-Beach.jpg', '2025-04-28 22:13:52'),
(93, 15, 'https://images.dwell.com/photos/6405098978284392448/6466705949096243200/large.jpg', '2025-04-28 22:13:52'),
(94, 16, 'http://cdn.home-designing.com/wp-content/uploads/2017/08/luxury-miami-beach-home.png', '2025-04-28 22:13:52'),
(95, 16, 'https://www.vacationkey.com/photos/1/2/125866-1.jpg', '2025-04-28 22:13:52'),
(96, 16, 'http://blogs.cotemaison.fr/archiboom/files/2013/11/maison-corail.jpg', '2025-04-28 22:13:52'),
(97, 17, 'https://photo.barnes-international.com/annonces/bms/40/min/MIA376283114-2.jpg', '2025-04-28 22:13:52'),
(98, 17, 'https://www.maison-miami.com/wp-content/uploads/2016/11/A10146616-15.jpg', '2025-04-28 22:13:52'),
(99, 17, 'https://www.maison-miami.com/wp-content/uploads/2016/07/vente-villa-768x517.jpg', '2025-04-28 22:13:52'),
(100, 18, 'https://realty-luxe.com/wp-content/uploads/2019/03/89aafe132c1c5218c2b746ecd81a6850l-m2xd-w1900_h1200_q100.jpg', '2025-04-28 22:13:52'),
(101, 18, 'https://images.unsplash.com/photo-1594322436404-5f26fa08ecb4', '2025-04-28 22:13:52'),
(102, 18, 'https://www.maison-miami.com/wp-content/uploads/2016/11/A10160568-1.jpg', '2025-04-28 22:13:52'),
(103, 19, 'https://archzine.fr/wp-content/uploads/2016/02/000-les-meilleures-maisons-a-miami-the-jills-brokerage-team-maison-de-luxe-avec-piscine-d-exterieur.jpg', '2025-04-28 22:13:52'),
(104, 19, 'https://ofcoursemiami.fr/wp-content/uploads/2015/01/960x540.jpg', '2025-04-28 22:13:52'),
(105, 19, 'https://luxury-houses.net/wp-content/uploads/2020/07/Ultra-luxury-Home-in-Miami-Beach-has-just-completed-33-1024x682.jpg', '2025-04-28 22:13:52'),
(106, 20, 'http://www.amenagementdesign.com/wp-content/uploads/2015/12/Villa-flottante-Miami.jpg', '2025-04-28 22:13:52'),
(107, 20, 'https://www.maison-miami.com/wp-content/uploads/2017/04/A10234617-12.jpeg', '2025-04-28 22:13:52'),
(108, 20, 'https://cdn.luxe.net/wp-content/uploads/2021/08/30144149/coral-gambles2_luxe.jpg', '2025-04-28 22:13:52'),
(109, 21, 'https://www.maison-miami.com/wp-content/uploads/2016/04/investissement-miami.jpg', '2025-04-28 22:13:52'),
(110, 21, 'https://realty-luxe.com/wp-content/uploads/2019/04/Maison-Miami-Beach-Piscine.jpg', '2025-04-28 22:13:52'),
(111, 21, 'https://static1.purepeople.com/articles/8/50/97/78/@/7445840-lionel-messi-loue-une-villa-200-000-doll-580x0-2.jpg', '2025-04-28 22:13:52'),
(112, 22, 'https://media-cdn.tripadvisor.com/media/vr-splice-j/07/6b/f5/c9.jpg', '2025-04-28 22:13:52'),
(113, 22, 'https://luxury-houses.net/wp-content/uploads/2020/04/2111-Lake-Ave-Miami-Beach-FL-1-1024x658.jpg', '2025-04-28 22:13:52'),
(114, 22, 'https://ofcoursemiami.fr/wp-content/uploads/2019/11/NGIMG_6487.jpg', '2025-04-28 22:13:52'),
(115, 23, 'http://localhost/flexii/uploads/img_682e78dda41fe.jpg', '2025-05-22 03:07:41'),
(116, 23, 'http://localhost/flexii/uploads/img_682e78dda4936.jpg', '2025-05-22 03:07:41'),
(117, 23, 'http://localhost/flexii/uploads/img_682e78dda4f52.jpg', '2025-05-22 03:07:41'),
(118, 23, 'http://localhost/flexii/uploads/img_682e78dda51c4.jpg', '2025-05-22 03:07:41'),
(119, 24, 'http://localhost/flexii/uploads/img_68305a4ce3bc4.jpg', '2025-05-23 13:21:49'),
(120, 24, 'http://localhost/flexii/uploads/img_68305a4ce530c.jpg', '2025-05-23 13:21:49'),
(121, 24, 'http://localhost/flexii/uploads/img_68305a4ce5702.jpg', '2025-05-23 13:21:49'),
(122, 24, 'http://localhost/flexii/uploads/img_68305a4ce5c22.jpg', '2025-05-23 13:21:49'),
(123, 25, 'http://localhost/flexii/uploads/img_68306ea191d26.jpg', '2025-05-23 14:48:33'),
(124, 25, 'http://localhost/flexii/uploads/img_68306ea19249c.jpg', '2025-05-23 14:48:33'),
(125, 25, 'http://localhost/flexii/uploads/img_68306ea192c25.jpg', '2025-05-23 14:48:33'),
(126, 25, 'http://localhost/flexii/uploads/img_68306ea193372.jpg', '2025-05-23 14:48:33'),
(127, 26, 'http://localhost/flexii/uploads/img_68307976a2220.jpg', '2025-05-23 15:34:46'),
(128, 26, 'http://localhost/flexii/uploads/img_68307976a2718.jpg', '2025-05-23 15:34:46'),
(129, 26, 'http://localhost/flexii/uploads/img_68307976a2bdf.jpg', '2025-05-23 15:34:46'),
(130, 26, 'http://localhost/flexii/uploads/img_68307976a2fa2.jpg', '2025-05-23 15:34:46'),
(131, 27, 'http://localhost/flexii/uploads/img_683088f214391.jpg', '2025-05-23 16:40:50'),
(132, 27, 'http://localhost/flexii/uploads/img_683088f217f51.jpg', '2025-05-23 16:40:50'),
(133, 27, 'http://localhost/flexii/uploads/img_683088f218237.jpg', '2025-05-23 16:40:50'),
(134, 27, 'http://localhost/flexii/uploads/img_683088f2194fb.jpg', '2025-05-23 16:40:50'),
(135, 28, 'http://localhost/flexii/uploads/img_68308bd0e2f8e.jpg', '2025-05-23 16:53:04'),
(136, 28, 'http://localhost/flexii/uploads/img_68308bd0e3908.jpg', '2025-05-23 16:53:04'),
(137, 28, 'http://localhost/flexii/uploads/img_68308bd0e3cb0.jpg', '2025-05-23 16:53:04'),
(138, 28, 'http://localhost/flexii/uploads/img_68308bd0e4580.jpg', '2025-05-23 16:53:04'),
(139, 29, 'http://localhost/flexii/uploads/img_68308e73ee359.jpg', '2025-05-23 17:04:20'),
(140, 29, 'http://localhost/flexii/uploads/img_68308e73eedd4.jpg', '2025-05-23 17:04:20'),
(141, 29, 'http://localhost/flexii/uploads/img_68308e73ef477.jpg', '2025-05-23 17:04:20'),
(142, 29, 'http://localhost/flexii/uploads/img_68308e73ef807.jpg', '2025-05-23 17:04:20'),
(143, 29, 'http://localhost/flexii/uploads/img_68308e73efce5.jpg', '2025-05-23 17:04:20'),
(144, 30, 'http://localhost/flexii/uploads/img_6830db4c1f5d7.jpg', '2025-05-23 22:32:12'),
(145, 30, 'http://localhost/flexii/uploads/img_6830db4c1f978.jpg', '2025-05-23 22:32:12'),
(146, 30, 'http://localhost/flexii/uploads/img_6830db4c1fc7c.jpg', '2025-05-23 22:32:12'),
(147, 30, 'http://localhost/flexii/uploads/img_6830db4c1ff79.jpg', '2025-05-23 22:32:12'),
(148, 31, 'http://localhost/flexii/uploads/img_68319e7d63236.jpg', '2025-05-24 12:25:01'),
(149, 31, 'http://localhost/flexii/uploads/img_68319e7d63668.jpg', '2025-05-24 12:25:01'),
(150, 31, 'http://localhost/flexii/uploads/img_68319e7d63839.jpg', '2025-05-24 12:25:01'),
(151, 31, 'http://localhost/flexii/uploads/img_68319e7d639ec.jpg', '2025-05-24 12:25:01'),
(152, 31, 'http://localhost/flexii/uploads/img_68319e7d63bb2.jpg', '2025-05-24 12:25:01'),
(161, 32, 'http://localhost/flexii/uploads/img_683391e9cd96e.jpg', '2025-05-25 23:55:53'),
(162, 32, 'http://localhost/flexii/uploads/img_683391e9cdb81.jpg', '2025-05-25 23:55:53'),
(163, 32, 'http://localhost/flexii/uploads/img_683391e9cde32.jpg', '2025-05-25 23:55:53'),
(164, 32, 'http://localhost/flexii/uploads/img_683391e9cdffd.jpg', '2025-05-25 23:55:53'),
(165, 32, 'http://localhost/flexii/uploads/img_683391e9ce261.jpg', '2025-05-25 23:55:53'),
(166, 32, 'http://localhost/flexii/uploads/img_683391e9ce444.jpg', '2025-05-25 23:55:53'),
(167, 32, 'http://localhost/flexii/uploads/img_683391e9ce5ed.jpg', '2025-05-25 23:55:53'),
(179, 1, 'https://img.jamesedition.com/listing_images/2019/11/01/15/08/51/ce24db5f-3352-488c-b66a-52bef962cdbe/je/2000xxs.jpg', '2025-05-27 22:36:11'),
(180, 1, 'https://luxhabitat.ae/resizedimages/1440w/article/546/source/8136985e7708b332a1574a8fe940ce800d6a329ac432785ad6dfa0639abf3551.jpg', '2025-05-27 22:36:11'),
(181, 1, 'http://localhost/flexii/uploads/img_68337e1e0bffa.webp', '2025-05-27 22:36:11'),
(182, 1, 'http://localhost/flexii/uploads/img_68337e1e0c391.jpeg', '2025-05-27 22:36:11'),
(183, 1, 'http://localhost/flexii/uploads/img_68337e1e0c7b6.webp', '2025-05-27 22:36:11'),
(184, 33, 'http://localhost/flexii/uploads/img_6836287da25bc.jpg', '2025-05-27 23:02:53'),
(185, 33, 'http://localhost/flexii/uploads/img_6836287da27bd.jpg', '2025-05-27 23:02:53'),
(186, 33, 'http://localhost/flexii/uploads/img_6836287da29d7.jpg', '2025-05-27 23:02:53'),
(187, 33, 'http://localhost/flexii/uploads/img_6836287da2be2.jpg', '2025-05-27 23:02:53'),
(188, 34, 'http://localhost/flexii/uploads/img_684964f4d26df.jpg', '2025-06-11 13:13:56'),
(189, 34, 'http://localhost/flexii/uploads/img_684964f4d2dae.jpg', '2025-06-11 13:13:56'),
(190, 34, 'http://localhost/flexii/uploads/img_684964f4d385d.jpg', '2025-06-11 13:13:56'),
(191, 34, 'http://localhost/flexii/uploads/img_684964f4d4187.jpg', '2025-06-11 13:13:56'),
(192, 34, 'http://localhost/flexii/uploads/img_684964f4d49bd.jpg', '2025-06-11 13:13:56'),
(193, 34, 'http://localhost/flexii/uploads/img_684964f4d51a2.jpg', '2025-06-11 13:13:56'),
(194, 35, 'http://localhost/flexii/uploads/img_684999e4d1b44.jpg', '2025-06-11 16:59:48'),
(195, 35, 'http://localhost/flexii/uploads/img_684999e4d2440.jpg', '2025-06-11 16:59:48'),
(196, 35, 'http://localhost/flexii/uploads/img_684999e4d2e05.jpg', '2025-06-11 16:59:48'),
(197, 35, 'http://localhost/flexii/uploads/img_684999e4d3709.jpg', '2025-06-11 16:59:48'),
(198, 35, 'http://localhost/flexii/uploads/img_684999e4d401e.jpg', '2025-06-11 16:59:48'),
(199, 36, 'http://localhost/flexii/uploads/img_68499a703519d.jpg', '2025-06-11 17:02:08'),
(200, 36, 'http://localhost/flexii/uploads/img_68499a7035a1b.jpg', '2025-06-11 17:02:08'),
(201, 36, 'http://localhost/flexii/uploads/img_68499a7036253.jpg', '2025-06-11 17:02:08'),
(202, 36, 'http://localhost/flexii/uploads/img_68499a7036c8b.jpg', '2025-06-11 17:02:08'),
(203, 36, 'http://localhost/flexii/uploads/img_68499a7037526.jpg', '2025-06-11 17:02:08'),
(204, 36, 'http://localhost/flexii/uploads/img_68499a7037e38.jpg', '2025-06-11 17:02:08'),
(205, 37, 'http://localhost/flexii/uploads/img_68499ae565d99.jpg', '2025-06-11 17:04:05'),
(206, 37, 'http://localhost/flexii/uploads/img_68499ae5666fa.jpg', '2025-06-11 17:04:05'),
(207, 37, 'http://localhost/flexii/uploads/img_68499ae566f81.jpg', '2025-06-11 17:04:05'),
(208, 37, 'http://localhost/flexii/uploads/img_68499ae5676ea.jpg', '2025-06-11 17:04:05'),
(209, 38, 'http://localhost/flexii/uploads/img_68499f01efcba.jpg', '2025-06-11 17:21:38'),
(210, 38, 'http://localhost/flexii/uploads/img_68499f01f015a.jpg', '2025-06-11 17:21:38'),
(211, 38, 'http://localhost/flexii/uploads/img_68499f01f04d9.jpg', '2025-06-11 17:21:38'),
(212, 38, 'http://localhost/flexii/uploads/img_68499f01f0f4f.jpg', '2025-06-11 17:21:38'),
(213, 38, 'http://localhost/flexii/uploads/img_68499f01f1cb9.jpg', '2025-06-11 17:21:38'),
(214, 38, 'http://localhost/flexii/uploads/img_68499f01f2493.jpg', '2025-06-11 17:21:38'),
(215, 38, 'http://localhost/flexii/uploads/img_68499f01f3010.jpg', '2025-06-11 17:21:38'),
(216, 38, 'http://localhost/flexii/uploads/img_68499f01f3738.jpg', '2025-06-11 17:21:38'),
(217, 38, 'http://localhost/flexii/uploads/img_68499f01f3d45.jpg', '2025-06-11 17:21:38'),
(218, 38, 'http://localhost/flexii/uploads/img_68499f02002be.jpg', '2025-06-11 17:21:38'),
(219, 39, 'http://localhost/flexii/uploads/img_68499f80cfe9b.jpg', '2025-06-11 17:23:44'),
(220, 39, 'http://localhost/flexii/uploads/img_68499f80d0cab.jpg', '2025-06-11 17:23:44'),
(221, 39, 'http://localhost/flexii/uploads/img_68499f80d1696.jpg', '2025-06-11 17:23:44'),
(222, 39, 'http://localhost/flexii/uploads/img_68499f80d1dfa.jpg', '2025-06-11 17:23:44'),
(223, 39, 'http://localhost/flexii/uploads/img_68499f80d2608.jpg', '2025-06-11 17:23:44'),
(224, 39, 'http://localhost/flexii/uploads/img_68499f80d31e7.jpg', '2025-06-11 17:23:44'),
(225, 40, 'http://localhost/flexii/uploads/img_68499ff9d9907.jpg', '2025-06-11 17:25:45'),
(226, 40, 'http://localhost/flexii/uploads/img_68499ff9d9bbb.jpg', '2025-06-11 17:25:45'),
(227, 40, 'http://localhost/flexii/uploads/img_68499ff9d9e20.jpg', '2025-06-11 17:25:45'),
(228, 40, 'http://localhost/flexii/uploads/img_68499ff9da0bd.jpg', '2025-06-11 17:25:45'),
(229, 40, 'http://localhost/flexii/uploads/img_68499ff9da306.jpg', '2025-06-11 17:25:45'),
(230, 40, 'http://localhost/flexii/uploads/img_68499ff9da5df.jpg', '2025-06-11 17:25:45'),
(231, 41, 'http://localhost/flexii/uploads/img_6849a05903372.jpg', '2025-06-11 17:27:21'),
(232, 41, 'http://localhost/flexii/uploads/img_6849a05903756.jpg', '2025-06-11 17:27:21'),
(233, 41, 'http://localhost/flexii/uploads/img_6849a05903bd6.jpg', '2025-06-11 17:27:21'),
(234, 41, 'http://localhost/flexii/uploads/img_6849a0590422a.jpg', '2025-06-11 17:27:21'),
(235, 41, 'http://localhost/flexii/uploads/img_6849a05904649.jpg', '2025-06-11 17:27:21'),
(236, 41, 'http://localhost/flexii/uploads/img_6849a0590552e.jpg', '2025-06-11 17:27:21'),
(237, 41, 'http://localhost/flexii/uploads/img_6849a059059e0.jpg', '2025-06-11 17:27:21'),
(238, 41, 'http://localhost/flexii/uploads/img_6849a05905c59.jpg', '2025-06-11 17:27:21'),
(239, 42, 'http://localhost/flexii/uploads/img_6849a3a1e83b3.jpg', '2025-06-11 17:41:21'),
(240, 42, 'http://localhost/flexii/uploads/img_6849a3a1e8787.jpg', '2025-06-11 17:41:21'),
(241, 42, 'http://localhost/flexii/uploads/img_6849a3a1e8aae.jpg', '2025-06-11 17:41:21'),
(242, 42, 'http://localhost/flexii/uploads/img_6849a3a1e8ca7.jpg', '2025-06-11 17:41:21'),
(243, 43, 'http://localhost/flexii/uploads/img_684c3852457cf.jpg', '2025-06-13 16:40:18'),
(244, 43, 'http://localhost/flexii/uploads/img_684c385246254.jpg', '2025-06-13 16:40:18'),
(245, 43, 'http://localhost/flexii/uploads/img_684c3852469e9.jpg', '2025-06-13 16:40:18'),
(246, 43, 'http://localhost/flexii/uploads/img_684c38524728f.jpg', '2025-06-13 16:40:18');

-- --------------------------------------------------------

--
-- Structure de la table `messagerie`
--

CREATE TABLE `messagerie` (
  `id` int(11) NOT NULL,
  `booking_id` int(11) NOT NULL,
  `sender_type` enum('user','host') NOT NULL,
  `sender_id` int(11) NOT NULL,
  `receiver_id` int(11) NOT NULL,
  `message` text NOT NULL,
  `sent_at` datetime DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Structure de la table `notifications`
--

CREATE TABLE `notifications` (
  `id` int(11) NOT NULL,
  `id_users` int(11) NOT NULL,
  `message` text NOT NULL,
  `vu` tinyint(1) DEFAULT 0,
  `date_creation` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Structure de la table `reviews`
--

CREATE TABLE `reviews` (
  `id` int(11) NOT NULL,
  `user_id` int(11) DEFAULT NULL,
  `listing_id` int(11) DEFAULT NULL,
  `rating` int(11) DEFAULT NULL CHECK (`rating` between 1 and 5),
  `comment` text DEFAULT NULL,
  `created_at` datetime DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Structure de la table `tasks`
--

CREATE TABLE `tasks` (
  `id` int(11) NOT NULL,
  `title` varchar(255) NOT NULL,
  `start_date` date NOT NULL,
  `end_date` date NOT NULL,
  `priority` enum('Haute','Moyenne','Faible') DEFAULT 'Moyenne',
  `status` enum('À faire','En cours','Terminé') DEFAULT 'À faire',
  `progress` tinyint(3) UNSIGNED DEFAULT 0,
  `deadline` date NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Structure de la table `tickets`
--

CREATE TABLE `tickets` (
  `id` int(11) NOT NULL,
  `titre` varchar(255) NOT NULL,
  `description` text NOT NULL,
  `statut` enum('Ouvert','En cours','Résolu','Fermé') DEFAULT 'Ouvert',
  `priorite` enum('Faible','Moyenne','Élevée','Critique') DEFAULT 'Moyenne',
  `date_creation` timestamp NOT NULL DEFAULT current_timestamp(),
  `date_mise_a_jour` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `id_employe` int(11) NOT NULL,
  `id_technicien` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Structure de la table `transactions`
--

CREATE TABLE `transactions` (
  `id` int(11) NOT NULL,
  `id_booking` int(11) NOT NULL,
  `type_transaction` enum('mobile money','espèces','taptap send') NOT NULL,
  `nom_mobile_money` varchar(100) DEFAULT NULL,
  `numero_mobile_money` varchar(20) DEFAULT NULL,
  `reference_transaction` varchar(100) DEFAULT NULL,
  `montant` decimal(10,2) NOT NULL,
  `devise` varchar(10) DEFAULT 'FCFA',
  `statut` enum('en attente','réussi','échoué') DEFAULT 'en attente',
  `date_transaction` datetime DEFAULT current_timestamp(),
  `commentaire` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `transactions`
--

INSERT INTO `transactions` (`id`, `id_booking`, `type_transaction`, `nom_mobile_money`, `numero_mobile_money`, `reference_transaction`, `montant`, `devise`, `statut`, `date_transaction`, `commentaire`) VALUES
(1, 1, 'espèces', NULL, NULL, 'USAGE-JP001-1', 2000.00, 'FCFA', 'réussi', '2025-06-09 15:18:07', 'Commission code agent JP001'),
(2, 2, 'espèces', NULL, NULL, 'USAGE-AB002-2', 1500.00, 'FCFA', 'réussi', '2025-06-09 15:18:07', 'Commission code agent AB002'),
(3, 3, 'espèces', NULL, NULL, 'USAGE-CD003-3', 1800.00, 'FCFA', 'réussi', '2025-06-09 15:18:07', 'Commission code agent CD003'),
(4, 1, 'espèces', NULL, NULL, 'PUB-JP001-1', 3000.00, 'FCFA', 'réussi', '2025-06-09 15:18:07', 'Commission publication logement agent JP001'),
(5, 2, 'espèces', NULL, NULL, 'PUB-AB002-2', 5000.00, 'FCFA', 'en attente', '2025-06-09 15:18:07', 'Commission publication véhicule agent AB002'),
(6, 3, 'espèces', NULL, NULL, 'PUB-CD003-3', 2500.00, 'FCFA', 'réussi', '2025-06-09 15:18:07', 'Commission publication logement agent CD003'),
(7, 12, 'mobile money', 'dds', '4972029858000792', NULL, 5000.00, 'FCFA', 'en attente', '2025-06-21 00:25:07', NULL),
(8, 13, 'mobile money', 'sjjhs', '4972029858000792', NULL, 5000.00, 'FCFA', 'en attente', '2025-06-22 12:01:09', NULL),
(9, 14, 'mobile money', 'ss', '4972029858000792', NULL, 5000.00, 'FCFA', 'en attente', '2025-06-22 12:02:13', NULL),
(10, 15, 'mobile money', 'kjkk', '4972029858000792', NULL, 5000.00, 'FCFA', 'en attente', '2025-06-22 12:18:35', NULL),
(11, 16, 'mobile money', 'dd', '4972029858000792', NULL, 5000.00, 'FCFA', 'en attente', '2025-06-22 12:36:25', NULL),
(12, 17, 'mobile money', 'jj', '4972029858000792', NULL, 5000.00, 'FCFA', 'en attente', '2025-06-22 12:46:37', NULL),
(13, 18, 'mobile money', 'jkk', '4972029858000792', NULL, 5000.00, 'FCFA', 'en attente', '2025-06-22 12:49:01', NULL),
(14, 19, 'mobile money', 'ss', '4972029858000792', NULL, 5000.00, 'FCFA', 'en attente', '2025-06-22 12:49:38', NULL),
(15, 20, 'mobile money', 'dd', '4972029858000792', NULL, 5000.00, 'FCFA', 'en attente', '2025-06-22 12:52:25', NULL),
(16, 21, 'mobile money', 'dd', '4972029858000792', NULL, 5000.00, 'FCFA', 'en attente', '2025-06-22 12:59:19', NULL),
(17, 22, 'mobile money', 'dd', '4972029858000792', NULL, 5000.00, 'FCFA', 'en attente', '2025-06-22 12:59:36', NULL),
(18, 23, 'mobile money', 'kks', '4972029858000792', NULL, 5000.00, 'FCFA', 'en attente', '2025-06-22 13:01:56', NULL),
(19, 24, 'mobile money', 's', '4972029858000792', NULL, 5000.00, 'FCFA', 'en attente', '2025-06-22 13:04:23', NULL),
(20, 25, 'mobile money', 'w', '4972029858000792', NULL, 5000.00, 'FCFA', 'en attente', '2025-06-22 13:07:06', NULL),
(21, 26, 'mobile money', 'ssd', '4972029858000792', NULL, 5000.00, 'FCFA', 'en attente', '2025-06-22 16:26:45', NULL),
(22, 27, 'mobile money', 'sss', '4972029858000792', NULL, 5000.00, 'FCFA', 'en attente', '2025-06-22 21:49:28', NULL),
(23, 28, 'mobile money', 'ssss', '4972029858000792', NULL, 5000.00, 'FCFA', 'en attente', '2025-06-22 21:55:23', NULL),
(24, 29, 'mobile money', 'sss', '4972029858000792', NULL, 5000.00, 'FCFA', 'réussi', '2025-06-22 21:57:46', NULL);

-- --------------------------------------------------------

--
-- Structure de la table `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `name` varchar(100) DEFAULT NULL,
  `email` varchar(100) DEFAULT NULL,
  `password_hash` varchar(255) DEFAULT NULL,
  `phone` varchar(20) DEFAULT NULL,
  `date_naissance` date DEFAULT NULL,
  `ville` varchar(100) DEFAULT NULL,
  `created_at` datetime DEFAULT current_timestamp(),
  `avatar_url` varchar(255) DEFAULT NULL,
  `role` enum('user','host','collaborateur','admin') NOT NULL DEFAULT 'user',
  `soldes` decimal(10,2) NOT NULL DEFAULT 0.00,
  `id_url` varchar(500) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `users`
--

INSERT INTO `users` (`id`, `name`, `email`, `password_hash`, `phone`, `date_naissance`, `ville`, `created_at`, `avatar_url`, `role`, `soldes`, `id_url`) VALUES
(1, 'Alice Dupont', 'alice1@example.com', 'hashed_pw_1', '060101010', '2025-05-10', 'pn', '2025-04-22 15:45:44', 'uploads/6847519204072_avatar.png', 'user', 0.00, 'uploads/684c17778b8d7_id.png'),
(2, 'Bob Martin', 'bob2@example.com', 'hashed_pw_2', '0602020202', NULL, NULL, '2025-04-22 15:45:44', 'https://i.natgeofe.com/k/1d33938b-3d02-4773-91e3-70b113c3b8c7/lion-male-roar_square.jpg', 'user', 0.00, ''),
(3, 'Claire Leroy', 'claire3@example.com', 'hashed_pw_3', '0603030303', NULL, NULL, '2025-04-22 15:45:44', 'https://i.natgeofe.com/k/1d33938b-3d02-4773-91e3-70b113c3b8c7/lion-male-roar_square.jpg\"', 'user', 0.00, ''),
(4, 'David Morel', 'david4@example.com', 'hashed_pw_4', '0604040404', NULL, NULL, '2025-04-22 15:45:44', '', 'user', 0.00, ''),
(5, 'Emma Girard', 'emma5@example.com', 'hashed_pw_5', '0605050505', NULL, NULL, '2025-04-22 15:45:44', '', 'user', 0.00, ''),
(6, 'Farid Nasri', 'farid6@example.com', 'hashed_pw_6', '0606060606', NULL, NULL, '2025-04-22 15:45:44', '', 'user', 0.00, ''),
(7, 'Giulia Rossi', 'giulia7@example.com', 'hashed_pw_7', '0607070707', NULL, NULL, '2025-04-22 15:45:44', '', 'user', 0.00, ''),
(8, 'Hiro Tanaka', 'hiro8@example.com', 'hashed_pw_8', '0608080808', NULL, NULL, '2025-04-22 15:45:44', '', 'user', 0.00, ''),
(9, 'Ibrahim Alami', 'ibrahim9@example.com', 'hashed_pw_9', '0609090909', NULL, NULL, '2025-04-22 15:45:44', '', 'user', 0.00, ''),
(10, 'Julia Olsen', 'julia10@example.com', 'hashed_pw_10', '0610101010', NULL, NULL, '2025-04-22 15:45:44', '', 'user', 0.00, ''),
(11, 'Karim Singh', 'karim11@example.com', 'hashed_pw_11', '0611111111', NULL, NULL, '2025-04-22 15:45:44', '', 'user', 0.00, ''),
(12, 'Laura Mendes', 'laura12@example.com', 'hashed_pw_12', '0612121212', NULL, NULL, '2025-04-22 15:45:44', '', 'user', 0.00, ''),
(13, 'mampouya jason', 'ja.mampouya@gmail.com', '$2y$10$nSPaBGW5ZoEUGHXx82ESjuJ0zdKYlQV8C8UMksCQ4h/ThzmjAzAP.', '0753770441', '2025-05-22', 'pnn', '2025-04-28 16:47:27', 'uploads/68548d59a5709_avatar.png', 'user', 0.00, 'uploads/684746748bd63_id.png'),
(14, 'Kionga Fredene', 'jasonmampouya.pro@gmail.com', '$2y$10$0dZoHxMIZAZ4VGvsrQxSs.d1rt0BTG73aTqWWoHOLcOEDZO06t/la', '064829868', NULL, NULL, '2025-04-28 17:54:59', 'f.png', 'user', 0.00, ''),
(15, 'sss ksksks', 'm@gmail.com', '$2y$10$wCdedH2ogEpqJnbZYUdl4.pfI6C6gilXhWM1iJSvOkPnnsWbOuihq', '55666', NULL, NULL, '2025-04-30 17:17:58', 'f.png', 'user', 0.00, ''),
(16, 'maria violeta', 'v@gmail.com', '$2y$10$OfifUD0OZ/gAT2b9Ne1dkeC/YALGsbDU2rc6zaw5V9/22R.7MOSHS', '0753770441', NULL, NULL, '2025-05-07 12:09:01', 'flexii.png', 'user', 0.00, ''),
(17, 'Jason Stephenes', 'jad.mampouya@gmail.com', '$2y$10$50MrD8knwlomrzB9bv/L7OR3Nn81QbL3zHTmPBDsNuTjxBvDLfS06', '0753770441', '2025-05-17', 'bz', '2025-05-29 11:59:15', 'flexii.png', 'user', 0.00, '');

-- --------------------------------------------------------

--
-- Structure de la table `vehicules`
--

CREATE TABLE `vehicules` (
  `id` int(11) NOT NULL,
  `marque` varchar(100) DEFAULT NULL,
  `modele` varchar(100) DEFAULT NULL,
  `annee` int(11) DEFAULT NULL,
  `kilometrage` int(11) DEFAULT NULL,
  `carburant` enum('essence','diesel','électrique','hybride') DEFAULT NULL,
  `transmission` enum('manuelle','automatique') DEFAULT NULL,
  `nombre_portes` int(11) DEFAULT NULL,
  `nombre_places` int(11) DEFAULT NULL,
  `couleur` varchar(50) DEFAULT NULL,
  `climatisation` tinyint(1) DEFAULT 0,
  `gps` tinyint(1) DEFAULT 0,
  `camera_recul` tinyint(1) DEFAULT 0,
  `etat` enum('neuf','occasion','accidenté') DEFAULT 'occasion',
  `type_vehicule` enum('citadine','berline','SUV','4x4','utilitaire','camionnette','moto') DEFAULT NULL,
  `puissance_fiscale` varchar(50) DEFAULT NULL,
  `consommation_moyenne` varchar(50) DEFAULT NULL,
  `controle_technique` date DEFAULT NULL,
  `disponible` tinyint(1) DEFAULT 1,
  `type_location` enum('achat','location_journalière') DEFAULT 'location_journalière',
  `price_per_day` decimal(10,2) DEFAULT NULL,
  `created_at` date DEFAULT current_timestamp(),
  `host_id` int(11) DEFAULT NULL,
  `title` varchar(255) DEFAULT NULL,
  `description` text DEFAULT NULL,
  `address` varchar(255) DEFAULT NULL,
  `city` varchar(100) DEFAULT NULL,
  `country` varchar(100) DEFAULT NULL,
  `price_for_sale` decimal(10,2) DEFAULT NULL,
  `weekend_discount` int(11) DEFAULT NULL,
  `price_per_month` decimal(10,2) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `vehicules`
--

INSERT INTO `vehicules` (`id`, `marque`, `modele`, `annee`, `kilometrage`, `carburant`, `transmission`, `nombre_portes`, `nombre_places`, `couleur`, `climatisation`, `gps`, `camera_recul`, `etat`, `type_vehicule`, `puissance_fiscale`, `consommation_moyenne`, `controle_technique`, `disponible`, `type_location`, `price_per_day`, `created_at`, `host_id`, `title`, `description`, `address`, `city`, `country`, `price_for_sale`, `weekend_discount`, `price_per_month`) VALUES
(1, 'Toyota', 'Corolla', 2020, 45000, 'essence', 'automatique', 4, 5, 'Gris', 1, 1, 0, 'occasion', 'berline', '6 CV', '6.5 L/100km', '2024-10-15', 1, 'location_journalière', 10000.00, '2025-05-22', 1, 'Toyota', 'voiture incroyable', 'poto-poto', 'Brazzaville', 'congo', NULL, NULL, 0.00),
(2, 'Peugeot', '208', 2019, 62000, 'diesel', 'manuelle', 5, 5, 'Bleu', 1, 0, 0, 'occasion', 'citadine', '4 CV', '5.2 L/100km', '2024-06-20', 1, 'location_journalière', 0.00, '2025-05-22', 9, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0.00),
(3, 'BMW', 'X5', 2022, 15000, 'essence', 'automatique', 5, 5, 'Noir', 1, 1, 1, 'neuf', 'SUV', '10 CV', '8.8 L/100km', '2025-01-10', 1, 'location_journalière', 0.00, '2025-05-22', 9, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0.00),
(4, 'Renault', 'Kangoo', 2018, 89000, 'diesel', 'manuelle', 4, 5, 'Blanc', 0, 0, 0, 'occasion', 'utilitaire', '5 CV', '7.0 L/100km', '2023-12-05', 1, 'location_journalière', 0.00, '2025-05-22', 9, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0.00),
(5, 'Tesla', 'Model 3', 2023, 10000, 'électrique', 'automatique', 4, 5, 'Rouge', 1, 1, 1, 'neuf', 'berline', 'N/A', '15 kWh/100km', '2025-02-01', 1, 'location_journalière', 0.00, '2025-05-22', 9, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0.00),
(6, 'Volkswagen', 'Golf', 2020, 40000, 'essence', 'manuelle', 5, 5, 'Noir', 1, 0, 1, 'occasion', 'citadine', '7 CV', '6.0 L/100km', '2024-09-12', 1, 'location_journalière', 0.00, '2025-05-22', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0.00),
(7, 'Mercedes', 'Sprinter', 2017, 120000, 'diesel', 'manuelle', 4, 3, 'Gris', 0, 0, 0, 'occasion', 'camionnette', '8 CV', '9.5 L/100km', '2023-11-20', 1, 'location_journalière', 0.00, '2025-05-22', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0.00),
(8, 'Kia', 'Sportage', 2021, 35000, 'hybride', 'automatique', 5, 5, 'Blanc', 1, 1, 1, 'occasion', 'SUV', '6 CV', '5.8 L/100km', '2024-04-14', 1, 'location_journalière', 0.00, '2025-05-22', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0.00),
(9, 'Honda', 'CB500F', 2022, 9000, 'essence', 'manuelle', 0, 2, 'Rouge', 0, 0, 0, 'neuf', 'moto', '5 CV', '3.5 L/100km', '2024-08-30', 1, 'location_journalière', 0.00, '2025-05-22', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0.00),
(10, 'Dacia', 'Duster', 2019, 70000, 'essence', 'manuelle', 5, 5, 'Vert', 1, 0, 0, 'occasion', 'SUV', '5 CV', '7.2 L/100km', '2024-01-18', 1, 'location_journalière', 0.00, '2025-05-22', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0.00),
(15, 'ggg', 'sxx', 2022, 0, 'essence', 'manuelle', 4, 5, 'dd', 1, 1, 1, 'accidenté', 'citadine', '455', '6,5', '2025-06-06', 1, 'location_journalière', 10000.00, '2025-05-22', 1, 'ggg sxx', 'Véhicule disponible', 'Poto-Poto', 'Brazzaville', 'Congo', NULL, 0, 0.00),
(16, 's', 'q', 2022, 0, 'essence', 'manuelle', 4, 5, 'qq', 1, 0, 1, 'accidenté', 'citadine', '445', '455', '2025-05-24', 1, 'location_journalière', 1222.00, '2025-05-23', 1, 's q', 'Véhicule disponible', 'Bacongo', 'Brazzaville', 'Congo', NULL, 0, 0.00),
(17, 'bmw', 'xxl', 2022, 455, 'électrique', 'manuelle', 4, 5, 'bleu', 1, 1, 1, 'accidenté', 'citadine', '6cv', '6,5', '2000-01-20', 1, 'location_journalière', 10000.00, '2025-05-27', 1, 'bmw xxl', 'Véhicule disponible', 'siafoumou', 'Pointe-Noire', 'Congo', NULL, 10, 0.00),
(18, 'fortuner', 'bxc', 2022, 45, 'diesel', 'automatique', 4, 5, 'bleu', 1, 0, 1, 'accidenté', 'citadine', '6', '5', '2014-02-22', 1, '', NULL, '2025-05-28', 1, 'fortuner bxc', 'Véhicule disponible', 'Bacongo', 'Brazzaville', 'Congo', 45666.00, 0, 0.00),
(19, 'bmx', 'fdd', 2024, 0, 'essence', 'automatique', 4, 5, 'noir', 1, 1, 1, 'neuf', 'citadine', '6cv', '6.5', '2025-06-12', 1, 'location_journalière', NULL, '2025-06-11', 1, 'bmx fdd', 'Véhicule disponible', 'Mfilou', 'Brazzaville', 'Congo', 50000.00, 0, 0.00),
(20, 'kll', 'klm', 2022, 0, 'essence', 'manuelle', 4, 5, 'ehhj', 1, 0, 1, 'occasion', 'berline', '6cv', '65l', '2025-06-13', 1, '', NULL, '2025-06-11', 1, 'kll klm', 'Véhicule disponible', 'kk', 'Brazzaville', 'Congo', NULL, 0, 0.00),
(21, 'nb', 'mkk', 2022, 0, 'diesel', 'manuelle', 4, 5, 'bleu', 1, 0, 1, 'occasion', 'citadine', '6cv', '6.5', '2025-06-20', 1, '', NULL, '2025-06-11', 1, 'nb mkk', 'Véhicule disponible', 'Bacongo', 'Brazzaville', 'Congo', NULL, 0, NULL),
(22, 'ggb', 'vv', 2022, 0, 'essence', 'manuelle', 4, 5, 'vvd', 0, 0, 1, 'occasion', 'berline', '6cv', '6.5', '2025-06-27', 1, '', NULL, '2025-06-11', 1, 'ggb vv', 'Véhicule disponible', 'Mfilou', 'Brazzaville', 'Congo', NULL, 0, 56458.00),
(23, 'scv', 'dsq', 2022, 0, 'essence', 'automatique', 4, 5, 'ruge', 1, 1, 1, 'accidenté', 'berline', '6l', '45', '2025-06-11', 1, '', NULL, '2025-06-11', 1, 'scv dsq', 'Véhicule disponible', 'ss', 'Brazzaville', 'Congo', 45888.00, 0, NULL);

-- --------------------------------------------------------

--
-- Structure de la table `visite`
--

CREATE TABLE `visite` (
  `id` int(11) NOT NULL,
  `booking_id` int(11) NOT NULL,
  `agent_id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `a_visite` tinyint(1) DEFAULT 0,
  `intention_achat` enum('oui','non','hésite') DEFAULT 'hésite',
  `contrat_promesse` tinyint(1) DEFAULT 0,
  `commentaire` text DEFAULT NULL,
  `created_at` datetime DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Index pour les tables déchargées
--

--
-- Index pour la table `agents`
--
ALTER TABLE `agents`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `code_agent` (`code_agent`),
  ADD KEY `user_id` (`user_id`);

--
-- Index pour la table `agent_code_usages`
--
ALTER TABLE `agent_code_usages`
  ADD PRIMARY KEY (`id`),
  ADD KEY `agent_id` (`agent_id`),
  ADD KEY `booking_id` (`booking_id`),
  ADD KEY `listing_id` (`listing_id`),
  ADD KEY `user_id` (`user_id`),
  ADD KEY `agent_code_usages_ibfk_5` (`code_agent`);

--
-- Index pour la table `agent_publications`
--
ALTER TABLE `agent_publications`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_agent_publications_agent` (`agent_id`),
  ADD KEY `fk_agent_publications_listing` (`listing_id`),
  ADD KEY `fk_agent_publications_vehicule` (`vehicule_id`);

--
-- Index pour la table `availabilities`
--
ALTER TABLE `availabilities`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `unique_listing_date` (`listing_id`,`date`);

--
-- Index pour la table `availabilities_agent`
--
ALTER TABLE `availabilities_agent`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_agent` (`agent_id`),
  ADD KEY `fk_agent1` (`listings_id`),
  ADD KEY `fk_agent2` (`vehicule_id`);

--
-- Index pour la table `availabilities_cars`
--
ALTER TABLE `availabilities_cars`
  ADD PRIMARY KEY (`id`),
  ADD KEY `vehicule_id` (`vehicule_id`);

--
-- Index pour la table `bookings`
--
ALTER TABLE `bookings`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `code_reservation` (`code_reservation`),
  ADD KEY `user_id` (`user_id`),
  ADD KEY `listing_id` (`listing_id`),
  ADD KEY `bookings_ibfk_3` (`code_agent`);

--
-- Index pour la table `bookings_cars`
--
ALTER TABLE `bookings_cars`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`),
  ADD KEY `vehicule_id` (`vehicule_id`);

--
-- Index pour la table `booking_agent`
--
ALTER TABLE `booking_agent`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `code_reservation` (`code_reservation`),
  ADD KEY `fk_booking_agent_agent` (`agent_id`),
  ADD KEY `fk_booking_agent_user` (`user_id`),
  ADD KEY `fk_booking_agent_user1` (`listing_id`),
  ADD KEY `fk_booking_agent_user2` (`vehicule_id`);

--
-- Index pour la table `car_comments`
--
ALTER TABLE `car_comments`
  ADD PRIMARY KEY (`id`),
  ADD KEY `vehicule_id` (`vehicule_id`),
  ADD KEY `user_id` (`user_id`);

--
-- Index pour la table `car_images`
--
ALTER TABLE `car_images`
  ADD PRIMARY KEY (`id`),
  ADD KEY `vehicule_id` (`vehicule_id`);

--
-- Index pour la table `comments`
--
ALTER TABLE `comments`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `unique_user_booking` (`booking_id`),
  ADD KEY `listing_id` (`listing_id`),
  ADD KEY `user_id` (`user_id`);

--
-- Index pour la table `favorites`
--
ALTER TABLE `favorites`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`),
  ADD KEY `listing_id` (`listing_id`);

--
-- Index pour la table `favorite_cars`
--
ALTER TABLE `favorite_cars`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`),
  ADD KEY `vehicule_id` (`vehicule_id`);

--
-- Index pour la table `hosts`
--
ALTER TABLE `hosts`
  ADD PRIMARY KEY (`id`);

--
-- Index pour la table `listings`
--
ALTER TABLE `listings`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`);

--
-- Index pour la table `listing_images`
--
ALTER TABLE `listing_images`
  ADD PRIMARY KEY (`id`),
  ADD KEY `listing_id` (`listing_id`);

--
-- Index pour la table `messagerie`
--
ALTER TABLE `messagerie`
  ADD PRIMARY KEY (`id`),
  ADD KEY `booking_id` (`booking_id`);

--
-- Index pour la table `reviews`
--
ALTER TABLE `reviews`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`),
  ADD KEY `listing_id` (`listing_id`);

--
-- Index pour la table `tasks`
--
ALTER TABLE `tasks`
  ADD PRIMARY KEY (`id`);

--
-- Index pour la table `transactions`
--
ALTER TABLE `transactions`
  ADD PRIMARY KEY (`id`),
  ADD KEY `id_booking` (`id_booking`);

--
-- Index pour la table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`);

--
-- Index pour la table `vehicules`
--
ALTER TABLE `vehicules`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_host_id` (`host_id`);

--
-- Index pour la table `visite`
--
ALTER TABLE `visite`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_visite_booking` (`booking_id`),
  ADD KEY `fk_visite_agent` (`agent_id`),
  ADD KEY `fk_visite_user` (`user_id`);

--
-- AUTO_INCREMENT pour les tables déchargées
--

--
-- AUTO_INCREMENT pour la table `agents`
--
ALTER TABLE `agents`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT pour la table `agent_code_usages`
--
ALTER TABLE `agent_code_usages`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT pour la table `agent_publications`
--
ALTER TABLE `agent_publications`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT pour la table `availabilities`
--
ALTER TABLE `availabilities`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=473;

--
-- AUTO_INCREMENT pour la table `availabilities_agent`
--
ALTER TABLE `availabilities_agent`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT pour la table `availabilities_cars`
--
ALTER TABLE `availabilities_cars`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT pour la table `bookings`
--
ALTER TABLE `bookings`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=40;

--
-- AUTO_INCREMENT pour la table `bookings_cars`
--
ALTER TABLE `bookings_cars`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT pour la table `booking_agent`
--
ALTER TABLE `booking_agent`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT pour la table `car_comments`
--
ALTER TABLE `car_comments`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT pour la table `car_images`
--
ALTER TABLE `car_images`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=89;

--
-- AUTO_INCREMENT pour la table `comments`
--
ALTER TABLE `comments`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=18;

--
-- AUTO_INCREMENT pour la table `favorites`
--
ALTER TABLE `favorites`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=119;

--
-- AUTO_INCREMENT pour la table `favorite_cars`
--
ALTER TABLE `favorite_cars`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT pour la table `hosts`
--
ALTER TABLE `hosts`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=13;

--
-- AUTO_INCREMENT pour la table `listings`
--
ALTER TABLE `listings`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=44;

--
-- AUTO_INCREMENT pour la table `listing_images`
--
ALTER TABLE `listing_images`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=247;

--
-- AUTO_INCREMENT pour la table `messagerie`
--
ALTER TABLE `messagerie`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT pour la table `reviews`
--
ALTER TABLE `reviews`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT pour la table `tasks`
--
ALTER TABLE `tasks`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT pour la table `transactions`
--
ALTER TABLE `transactions`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=25;

--
-- AUTO_INCREMENT pour la table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=18;

--
-- AUTO_INCREMENT pour la table `vehicules`
--
ALTER TABLE `vehicules`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=24;

--
-- AUTO_INCREMENT pour la table `visite`
--
ALTER TABLE `visite`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- Contraintes pour les tables déchargées
--

--
-- Contraintes pour la table `agents`
--
ALTER TABLE `agents`
  ADD CONSTRAINT `agents_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Contraintes pour la table `agent_code_usages`
--
ALTER TABLE `agent_code_usages`
  ADD CONSTRAINT `agent_code_usages_ibfk_1` FOREIGN KEY (`agent_id`) REFERENCES `agents` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `agent_code_usages_ibfk_2` FOREIGN KEY (`booking_id`) REFERENCES `bookings` (`id`) ON DELETE SET NULL,
  ADD CONSTRAINT `agent_code_usages_ibfk_3` FOREIGN KEY (`listing_id`) REFERENCES `listings` (`id`) ON DELETE SET NULL,
  ADD CONSTRAINT `agent_code_usages_ibfk_4` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `agent_code_usages_ibfk_5` FOREIGN KEY (`code_agent`) REFERENCES `agents` (`code_agent`);

--
-- Contraintes pour la table `agent_publications`
--
ALTER TABLE `agent_publications`
  ADD CONSTRAINT `fk_agent_publications_agent` FOREIGN KEY (`agent_id`) REFERENCES `agents` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `fk_agent_publications_listing` FOREIGN KEY (`listing_id`) REFERENCES `listings` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `fk_agent_publications_vehicule` FOREIGN KEY (`vehicule_id`) REFERENCES `vehicules` (`id`) ON DELETE CASCADE;

--
-- Contraintes pour la table `availabilities`
--
ALTER TABLE `availabilities`
  ADD CONSTRAINT `availabilities_ibfk_1` FOREIGN KEY (`listing_id`) REFERENCES `listings` (`id`) ON DELETE CASCADE;

--
-- Contraintes pour la table `availabilities_agent`
--
ALTER TABLE `availabilities_agent`
  ADD CONSTRAINT `fk_agent` FOREIGN KEY (`agent_id`) REFERENCES `agents` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `fk_agent1` FOREIGN KEY (`listings_id`) REFERENCES `listings` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `fk_agent2` FOREIGN KEY (`vehicule_id`) REFERENCES `vehicules` (`id`) ON DELETE CASCADE;

--
-- Contraintes pour la table `availabilities_cars`
--
ALTER TABLE `availabilities_cars`
  ADD CONSTRAINT `availabilities_cars_ibfk_1` FOREIGN KEY (`vehicule_id`) REFERENCES `vehicules` (`id`) ON DELETE CASCADE;

--
-- Contraintes pour la table `bookings`
--
ALTER TABLE `bookings`
  ADD CONSTRAINT `bookings_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`),
  ADD CONSTRAINT `bookings_ibfk_2` FOREIGN KEY (`listing_id`) REFERENCES `listings` (`id`),
  ADD CONSTRAINT `bookings_ibfk_3` FOREIGN KEY (`code_agent`) REFERENCES `agents` (`code_agent`);

--
-- Contraintes pour la table `bookings_cars`
--
ALTER TABLE `bookings_cars`
  ADD CONSTRAINT `bookings_cars_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `bookings_cars_ibfk_2` FOREIGN KEY (`vehicule_id`) REFERENCES `vehicules` (`id`) ON DELETE CASCADE;

--
-- Contraintes pour la table `booking_agent`
--
ALTER TABLE `booking_agent`
  ADD CONSTRAINT `fk_booking_agent_agent` FOREIGN KEY (`agent_id`) REFERENCES `agents` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `fk_booking_agent_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `fk_booking_agent_user1` FOREIGN KEY (`listing_id`) REFERENCES `listings` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `fk_booking_agent_user2` FOREIGN KEY (`vehicule_id`) REFERENCES `vehicules` (`id`) ON DELETE CASCADE;

--
-- Contraintes pour la table `car_comments`
--
ALTER TABLE `car_comments`
  ADD CONSTRAINT `car_comments_ibfk_1` FOREIGN KEY (`vehicule_id`) REFERENCES `vehicules` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `car_comments_ibfk_2` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Contraintes pour la table `car_images`
--
ALTER TABLE `car_images`
  ADD CONSTRAINT `car_images_ibfk_1` FOREIGN KEY (`vehicule_id`) REFERENCES `vehicules` (`id`) ON DELETE CASCADE;

--
-- Contraintes pour la table `comments`
--
ALTER TABLE `comments`
  ADD CONSTRAINT `comments_ibfk_1` FOREIGN KEY (`listing_id`) REFERENCES `listings` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `comments_ibfk_2` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `fk_comment_booking` FOREIGN KEY (`booking_id`) REFERENCES `bookings` (`id`) ON DELETE SET NULL;

--
-- Contraintes pour la table `favorites`
--
ALTER TABLE `favorites`
  ADD CONSTRAINT `favorites_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`),
  ADD CONSTRAINT `favorites_ibfk_2` FOREIGN KEY (`listing_id`) REFERENCES `listings` (`id`);

--
-- Contraintes pour la table `favorite_cars`
--
ALTER TABLE `favorite_cars`
  ADD CONSTRAINT `favorite_cars_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `favorite_cars_ibfk_2` FOREIGN KEY (`vehicule_id`) REFERENCES `vehicules` (`id`) ON DELETE CASCADE;

--
-- Contraintes pour la table `listings`
--
ALTER TABLE `listings`
  ADD CONSTRAINT `listings_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`);

--
-- Contraintes pour la table `listing_images`
--
ALTER TABLE `listing_images`
  ADD CONSTRAINT `listing_images_ibfk_1` FOREIGN KEY (`listing_id`) REFERENCES `listings` (`id`);

--
-- Contraintes pour la table `messagerie`
--
ALTER TABLE `messagerie`
  ADD CONSTRAINT `fk_messagerie_booking` FOREIGN KEY (`booking_id`) REFERENCES `bookings` (`id`) ON DELETE CASCADE;

--
-- Contraintes pour la table `reviews`
--
ALTER TABLE `reviews`
  ADD CONSTRAINT `reviews_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`),
  ADD CONSTRAINT `reviews_ibfk_2` FOREIGN KEY (`listing_id`) REFERENCES `listings` (`id`);

--
-- Contraintes pour la table `transactions`
--
ALTER TABLE `transactions`
  ADD CONSTRAINT `transactions_ibfk_1` FOREIGN KEY (`id_booking`) REFERENCES `bookings` (`id`) ON DELETE CASCADE;

--
-- Contraintes pour la table `vehicules`
--
ALTER TABLE `vehicules`
  ADD CONSTRAINT `fk_host_id` FOREIGN KEY (`host_id`) REFERENCES `hosts` (`id`) ON DELETE SET NULL;

--
-- Contraintes pour la table `visite`
--
ALTER TABLE `visite`
  ADD CONSTRAINT `fk_visite_agent` FOREIGN KEY (`agent_id`) REFERENCES `agents` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `fk_visite_booking` FOREIGN KEY (`booking_id`) REFERENCES `booking_agent` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `fk_visite_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
