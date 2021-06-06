
# template:  node - express - typescript - socket.io - nodemon


## I tried to create a new node/express server that
 - used typescript
 - used nodemon (or ts-node, or ts-node-dev) - in some combination, to hot-recompile / reload as needed
 - used socket.io 

There is so much wrong info out there, so many too-specific examples, so many left-out-but-important details, outdated info, mistaken info, conflicting info.

It was unbelievably difficult to get this to work (for me).  I assume others can benefit from this working example.

Laundry list of terms/concepts/things that caused me grief (I'd like to make a word cloud out of this, and use it for target practice):
ts-node commonjs esm typescript tsc tsconfig.json target es5 ESNext module moduleResolution nodemon.json watch ignore type module --loader tslib skipLibCheck importHelpers esModuleInterop

This does (AFAIK) absolutely no more than what is needed, in order to scaffold the above feature set.

Assumptions:
- source folder is "src"
- transpiled js is saved to "dist"
- npm entry point is src/server.ts
- socket.io will accept connections from clients on localhost:3000 or localhost:5000 (in my case, react apps)


---

### start at a bash/cmd prompt in the parent directory of the project:

```
mkdir projectdir && cd projectdir
git init
mkdir src
mkdir dist
tsc --init

code .
```

### add .gitignore:

```
  node_modules
  dist
```

```
npm init

entry point: /dist/server.js
```

```
npm i express socket.io cors tslib
npm i --save-dev typescript @types/express @types/node nodemon ts-node-dev
```

### add npm scripts

```
  "scripts": {
  "start": "nodemon ./dist/server.js",
    "dev": "ts-node-dev --respawn --transpile-only ./src/server.ts"
  },
```

---

### tsconfig.json - replace what tsc --init did with the following:

```
{
  "compilerOptions": {
    "skipLibCheck": true,
    "target": "es2017",
    "module": "commonjs",
    "lib": ["esnext"],
    "importHelpers": true,
    "moduleResolution": "node",
    "typeRoots": [
      "node_modules/@types"
    ],
    "types": [
      "node"
    ],
    "allowSyntheticDefaultImports": true,
    "esModuleInterop": true,
    "baseUrl": ".",
    "outDir": "dist",
    "rootDir": "src",
    "strict": true,
    "noImplicitAny": true,
    "allowJs": true,
    "sourceMap": true,
  },
  "compileOnSave": true,
  "include": [
    "./src/**/*"
  ]
}
```

---

### src/server.ts - main server entry point - paste in the following:

```
import express from 'express'
import http from 'http'
import cors from 'cors'
import { Server, Socket } from 'socket.io'

const app = express()
const PORT = 53714
app.use(cors())

const server = http.createServer(app)

const options = {
    cors: {
        origin: [
            'http://localhost:3000',
            'http://localhost:5000'
        ],
        methods: ["GET", "POST"],
        credentials: true
    }
}

const io = new Server(server, options)

io.on("connection", (socket: Socket) => {
    const sid = socket.id;
    console.log(`server: CONN:: ${sid}`)
    socket.on("disconnect", reason => {
        console.log(`server: DISC:: ${sid} - ${reason}`)
    })

    socket.emit("test1", `connected!  socket id = ${socket.id}`)
})

server.listen(PORT, () => console.log(`started server on ${PORT}`))
```

---

## all done!

`npm run dev`

unlike 6.022e+23 other things I found/tried, THIS WORKS.


