# QAify

> Streamlined quality assurance for AI interactions, designed for developers and QA teams.

**Status:** 🚧 In Development

## Problem
AI development teams face delays and inconsistencies in validating their AI agents' performance due to cumbersome manual testing. QAify automates the QA process, ensuring AI agents behave as intended across different scenarios.

## MVP Features
- Automated testing scripts generation for specific AI interactions
- User-friendly interface for non-technical QA team members
- Integration with popular AI platforms (e.g., Dialogflow, Rasa)
- Real-time performance metrics and reports
- Collaboration tools for feedback and issue tracking among team members

## Tech Stack
- **Frontend:** Next.js 14 (App Router)
- **Backend:** Next.js API Routes
- **Database:** Supabase Postgres
- **Auth:** Supabase Auth
- **Payments:** Stripe
- **Hosting:** Vercel

## Architecture Notes
Using Next.js for both front-end and back-end allows for rapid development and deployment, utilizing API Routes for server-side logic. Supabase provides a seamless integration for authentication and database management, allowing scaling and managing users easily.

## User Stories
- Automated Test Script Generation
- User-Friendly Interface
- Integration with AI Platforms
- Real-time Performance Metrics
- Collaboration Tools for Feedback
- Subscription Management
- Email Sign-Up for Early Access
- Admin Dashboard

## Launch Checklist
- [ ] Complete landing page design
- [ ] Implement API endpoints for test generation and execution
- [ ] Develop dashboard interfaces for users and admins
- [ ] Set up subscription management with Stripe integration
- [ ] Test the integration with Dialogflow and Rasa

## Setup
```bash
cp .env.example .env.local
# Fill in your environment variables
npm install
npm run dev
```