import express,{urlencoded} from 'express'
import cookieParser from 'cookie-parser'
const app=express()
app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(cookieParser())
//import routes
import healthRoutes from "../src/routes/healthcheck.routes.js"
import userRoutes from "../src/routes/auth.routes.js"
import projectRoutes from "../src/routes/project.routes.js"
import notesRoutes from "../src/routes/note.routes.js"
app.use("/api/v1/users", userRoutes)
app.use("/api/v1/healtcheck",healthRoutes)
app.use("/api/v1/projects",projectRoutes)
app.use("/api/v1/notes",notesRoutes)
export default app
