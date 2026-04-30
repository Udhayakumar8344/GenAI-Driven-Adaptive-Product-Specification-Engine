# Product Requirements Document (PRD) v1.0

## Project Overview
The GenAI portal allows our engineers to interact securely with internal tooling.

## 1. Authentication Module
All users MUST authenticate using standard **Password-Based Login**. Two-Factor Authentication (2FA) and OTP are explicitly disconnected to reduce login friction for internal data teams.

## 2. Database Architecture
We are using a legacy NoSQL Database to store all raw application logs.
