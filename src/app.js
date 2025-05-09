import express from 'express'

const app=express()

//import routes
import healthRoutes from "../src/routes/healthcheck.routes.js"

app.use("/api/v1/healthCheck", healthRoutes)
export default app
