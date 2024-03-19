const express = require('express'); // Importa la llibreria Express per gestionar les rutes
const router = express.Router(); // Crea un router d'Express
const multer = require('multer'); // Importa la llibreria multer per gestionar peticions de fitxers
const bcrypt = require('bcrypt'); // Importa la llibreria bcrypt per a encriptar contrasenyes
const jwt = require('jsonwebtoken'); // Importa la llibreria jsonwebtoken per a generar i verificar JWT

const SECRET_KEY = "yeah-perdonen-kame-kame-ha"; // Clau secreta per a la generació de JWT

const {User, Task, Project, Comment} = require('./models'); // importem models de dades

const {
    createItem,
    updateItem,
    deleteItem,
    readItem,
    readItems
  } = require('./generics'); // Importa les funcions per a realitzar operacions CRUD genèriques

// Configuració de multer per gestionar la pujada de fitxers
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, '../regira-front/public/img') // Especifica la carpeta de destinació dels fitxers pujats
    },
    filename: function (req, file, cb) {
      cb(null, `${Date.now()}_${file.originalname}`) // Assigna un nom únic als fitxers pujats
    }
  })
  
  const upload = multer({ storage: storage }).single('foto'); // Configura multer per a gestionar la pujada d'un únic fitxer amb el camp 'foto'


// AUTENTICACIO

// Middleware per verificar el JWT en la cookie
const checkToken = (req, res, next) => {
    const token = req.cookies?.token; // Obté el token des de la cookie de la petició
    if (!token) {
      return res.status(401).json({ error: 'Unauthorized' }); // Retorna error 401 si no hi ha cap token
    }
  
    try {
      const decodedToken = jwt.verify(token, SECRET_KEY); // Verifica el token utilitzant la clau secreta
      req.userId = decodedToken.userId; // Estableix l'ID d'usuari a l'objecte de la petició
      next(); // Passa al següent middleware
    } catch (error) {
      return res.status(401).json({ error: 'Invalid token' }); // Retorna error 401 si el token és invàlid
    }
  };




/*

████████╗ █████╗ ███████╗██╗  ██╗███████╗
╚══██╔══╝██╔══██╗██╔════╝██║ ██╔╝██╔════╝
   ██║   ███████║███████╗█████╔╝ ███████╗
   ██║   ██╔══██║╚════██║██╔═██╗ ╚════██║
   ██║   ██║  ██║███████║██║  ██╗███████║
   ╚═╝   ╚═╝  ╚═╝╚══════╝╚═╝  ╚═╝╚══════╝
                                         
*/                   

// Operacions CRUD per a les Task

router.get('/task', async (req, res) => await readItems(req, res, Task)); 
router.get('/task/:projectId', async (req, res) => await readItems(req, res, Task));
router.put('/task/:id', async (req, res) => await updateItem(req, res, Task));
router.delete('/task/:id', async (req, res) => await deleteItem(req, res, Task));
router.post('/task', async (req, res) => await createItem(req, res, Task));

// PUT DRAGGABLE
router.put('/task/:taskId', async (req, res) => {
  try {
      const existingTask = await Task.findByPk(req.params.taskId);

      if (!existingTask) {
          return res.status(400).json({ error: 'Task not found' });
      }

      if (req.body.name) {
          existingTask.name = req.body.name;
      }
      if (req.body.description) {
          existingTask.description = req.body.description;
      }
      if (req.body.priority) {
          existingTask.priority = req.body.priority;
      }
      if (req.body.state) {
          existingTask.state = req.body.state;
      }
      if (req.body.task_type) {
          existingTask.task_type = req.body.task_type;
      }

      await existingTask.save();

      return res.status(200).json({ message: 'Task updated' });
  } catch (error) {
      return res.status(500).json({ error: `Error updating task ${taskId}` });
  }
});

/// GET PER RETORNAR EL DETALL D'UN PROJECTE
router.get('/project/task/:projectId', async (req, res) => {
  try {
    const project = await Project.findByPk(req.params.projectId); // Cerca el projecte pel seu ID
    if (!project) {
      return res.status(404).json({ error: 'Projecte no trobat' }); // Retorna error 404 si el projecte no es troba
    }
    const tasks = await project.getTasks(); // Obté totes els issues del projecte
    res.json(tasks); // Retorna les issues
  } catch (error) {
    res.status(500).json({ error: error.message }); // Retorna error 500 amb el missatge d'error
  }
});

/// GET PER RETORNAR LES TASKS D'UN PROJECTE
/*
router.get('/task/:projectId', async (req, res) => {
  try {
    const project = await Project.findByPk(req.params.projectId); // Cerca el projecte pel seu ID
    if (!project) {
      return res.status(404).json({ error: 'Projecte no trobat' }); // Retorna error 404 si el projecte no es troba
    }
    const tasks = await project.getTasks(); // Obté totes els issues del projecte
    res.json(tasks); // Retorna les issues
  } catch (error) {
    res.status(500).json({ error: error.message }); // Retorna error 500 amb el missatge d'error
  }
});
*/

// POST DE UN TASK DE UN PROYECTO CONCRETO
router.post('/task/project/:projectId', checkToken, async (req, res, next) => {
  try {
      const user = await User.findByPk(req.userId);
      if (!user) {
          return res.status(500).json({ error: 'User not found' });
      }

      req.body.userId = req.userId;
      req.body.projectId = req.params.projectId;

      upload(req, res, async function (err) {
          if (err) {
              return res.status(500).json({ error: err.message });
          }

          if (req.file) {
              req.body.foto = req.file.filename;
          }

          const item = await user.createTask(req.body);
          res.status(201).json(item);
      });
  } catch (error) {
      res.status(500).json({ error: error.message });
  }
});

// GET DE LAS TASK DE UN PROYECTO
router.get('/task/project/:projectId', checkToken, async (req, res) => {
  try {
      const project = await Project.findByPk(req.params.projectId, { include: Task });
      if (!project) {
          return res.status(404).json({ error: 'Project not found' });
      }
      res.json(project);
  } catch (error) {
      res.status(500).json({ error: error.message });
  }
});


/*
//// POST PER CREAR UNA TASK PER UN PROJECTE
router.post('/project/task/:projectId', async (req, res) => {
  try {
    const projecte = await Project.findByPk(req.params.projectId); // Cerca el projecte pel seu ID
    if (!projecte) {
      return res.status(404).json({ error: 'Projecte no trobat' }); // Retorna error 404 si el projecte no es troba
    }
    const item = await projecte.createTask(req.body); // Crea issue per al projecte indicat
    res.status(201).json(item); // Retorna el issue creat amb el codi d'estat 201
  } catch (error) {
    res.status(500).json({ error: error.message }); // Retorna error 500 amb el missatge d'error
  }
});
*/

// Endpoint per vincular una issue a un usuari
router.post('/task/:id_task/users/:id_user', async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id_user);
    const task = await Task.findByPk(req.params.id_task);
    if (!user || !task) {
      return res.status(404).json({ error: 'Issue o User no trobats' });
    }
    await user.addTask(task);
    res.json({ message: 'Issue actualitzat' }); // Retorna missatge d'èxit
  } catch (error) {
    res.status(500).json({ error: error.message }); // Retorna error 500 amb el missatge d'error
  }
});


// Endpoint per modificar una task
router.patch('/task/:id_task', async (req, res) => {

  try {
    const existingTask = await Task.findByPk(id_task);

    if (!existingTask) {
      return res.status(404).json({ error: "No s'ha trobat cap task amb aquest ID" });
    }

    // Actualitzem només les propietats que es reben al body
    if (req.body.title) {
      existingTask.title = req.body.title;
    }
    if (req.body.desc) {
      existingTask.desc = req.body.desc;
    }
    if (req.body.type) {
      existingTask.type = req.body.type;
    }
    if (req.body.priority) {
      existingTask.priority = req.body.priority;
    }
    if (req.body.state) {
      existingTask.state = req.body.state;
    }

    // Guardem els canvis
    await existingTask.save();

    return res.status(200).json({ message: 'Issue actualitzada' });
  } catch (error) {
    return res.status(500).json({ error: `Error actualitzant la issue "{id_issue}` });
  }
});


// Operacions CRUD per als Project
router.post('/project', async (req, res) => await createItem(req, res, Project)); // Crea un Project
router.get('/project', async (req, res) => await readItems(req, res, Project)); // Llegeix totes les Project
router.get('/project/:id', async (req, res) => await readItem(req, res, Project)); // Llegeix una Project específica
// router.put('/project/:id', async (req, res) => await updateItem(req, res, Project)); // Actualitza una Project
router.delete('/project/:id', async (req, res) => await deleteItem(req, res, Project)); // Elimina una Project

// Operacions CRUD per als Comments
router.post('/comments', async (req, res) => await createItem(req, res, Comment)); // Crea un Comment
router.get('/comments', async (req, res) => await readItems(req, res, Comment)); // Llegeix totes les Comment
router.get('/comments/:id', async (req, res) => await readItem(req, res, Comment)); // Llegeix una Comments específica
router.put('/comments/:id', async (req, res) => await updateItem(req, res, Comment)); // Actualitza una Comment
router.delete('/comments/:id', async (req, res) => await deleteItem(req, res, Comment)); // Elimina una Comment


// Operacions CRUD per a Users
router.get('/users', async (req, res) => await readItems (req, res, User));
router.get('/users/:id', async (req, res) => await readItem(req, res, User)); // Llegeix un User específic
router.put('/users/:id', async (req, res) => await updateItem(req, res, User)); // Actualitza un User
router.delete('/users/:id', async (req, res) => await deleteItem(req, res, User)); // Elimina un User




///// LOGIN I REGISTRE

// Endpoint per iniciar sessió d'un usuari
router.post('/login', async (req, res) => {
  const { email, password } = req.body; // Obté l'email i la contrasenya de la petició
  try {
    const user = await User.findOne({ where: { email } }); // Cerca l'usuari pel seu email
    if (!user) {
      return res.status(404).json({ error: 'User no trobat' }); // Retorna error 404 si l'usuari no es troba
    }
    const passwordMatch = await bcrypt.compare(password, user.password); // Compara la contrasenya proporcionada amb la contrasenya encriptada de l'usuari
    if (!passwordMatch) {
      return res.status(401).json({ error: 'Password incorrecte' }); // Retorna error 401 si la contrasenya és incorrecta
    }
    const token = jwt.sign({ userId: user.id, userName: user.name }, SECRET_KEY, { expiresIn: '2h' }); // Genera un token JWT vàlid durant 2 hores
    res.cookie('token', token, { httpOnly: false, maxAge: 7200000 }); // Estableix el token com una cookie
    res.json({ message: 'Login correcte' }); // Retorna missatge d'èxit
  } catch (error) {
    res.status(500).json({ error: error.message }); // Retorna error 500 amb el missatge d'error
  }
});

router.get('/refresh', checkToken, async (req, res) => {
  const user = await User.findByPk(req.userId);
  if (!user) {
      return res.status(404).json({ error: 'User not found' });
  }
  return res.json({ id: user.id, name: user.name })
})

// Endpoint per registrar un usuari
router.post('/register', async (req, res) => {
    try {
      const { name, email, password } = req.body; // Obté el nom, email i contrasenya de la petició
      if (!name || !email || !password) {
        return res.status(400).json({ error: 'Name, email, i password requerits' }); // Retorna error 400 si no es proporcionen el nom, email o contrasenya
      }
      const existingUser = await User.findOne({ where: { email } }); // Comprova si l'email ja està registrat
      if (existingUser) {
        return res.status(400).json({ error: 'Email ja existeix' }); // Retorna error 400 si l'email ja està registrat
      }
      const user = await User.create({ name, email, password }); // Crea l'usuari amb les dades proporcionades
      res.status(201).json(user); // Retorna l'usuari creat amb el codi d'estat 201 (Creat)
    } catch (error) {
      res.status(500).json({ error: error.message }); // Retorna error 500 amb el missatge d'error
    }
  });


// ENDPOINTS

// Endpoint per crear una tasca (amb foto)
router.post('/task', checkToken, async (req, res, next) => {
  try {
    const user = await User.findByPk(req.userId); 
    if (!user) {
    return res.status(500).json({ error: 'User no trobat' });
    }

    req.body.userId = req.userId; // Estableix l'ID de l'usuari en el cos de la petició

    upload(req, res, async function (err) { // Gestiona la pujada del fitxer
      if (err) {
        return res.status(500).json({ error: err.message }); // Retorna error 500 si hi ha algun error en la pujada del fitxer
      }
      if (req.file) {
        req.body.foto = req.file.filename; // Assigna el nom del fitxer pujat al camp 'foto'
      }

      const item = await user.createTask(req.body); 
      res.status(201).json(item); // Retorna l'objecte del task creat amb el codi d'estat 201 (Creat)
    });

  } catch (error) {
    res.status(500).json({ error: error.message }); // Retorna error 500 amb el missatge d'error
  }
});

// Endpoint per crear un projecte (amb foto)
router.post('/project', checkToken, async (req, res, next) => {
  try {
    const user = await User.findByPk(req.userId); 
    if (!user) {
    return res.status(500).json({ error: 'User no trobat' });
    }

    req.body.userId = req.userId; // Estableix l'ID de l'usuari en el cos de la petició

    upload(req, res, async function (err) { // Gestiona la pujada del fitxer
      if (err) {
        return res.status(500).json({ error: err.message }); // Retorna error 500 si hi ha algun error en la pujada del fitxer
      }
      if (req.file) {
        req.body.foto = req.file.filename; // Assigna el nom del fitxer pujat al camp 'foto'
      }

      const item = await user.createProject(req.body); // Crea un nou bolet amb les dades rebudes
      res.status(201).json(item); // Retorna l'objecte del bolet creat amb el codi d'estat 201 (Creat)
    });

  } catch (error) {
    res.status(500).json({ error: error.message }); // Retorna error 500 amb el missatge d'error
  }
});

/*
// Endpoint per vincular una tag a un task
router.post('/task/:taskId/tags/:tagId', async (req, res) => {
  try {
    const bolet = await Bolet.findByPk(req.params.boletId); // Cerca el bolet pel seu ID
    const tag = await Tag.findByPk(req.params.tagId); // Cerca l'etiqueta pel seu ID
    if (!bolet || !tag) {
      return res.status(404).json({ error: 'Bolet o Tag no trobats' }); // Retorna error 404 si el bolet o l'etiqueta no es troben
    }
    await bolet.addTag(tag); // Afegeix l'etiqueta al bolet
    res.json({ message: 'Tag linkat' }); // Retorna missatge d'èxit
  } catch (error) {
    res.status(500).json({ error: error.message }); // Retorna error 500 amb el missatge d'error
  }
});
*/

/*
// Endpoint per obtenir totes les etiquetes per a un bolet
router.get('/bolets/:boletId/tags', async (req, res) => {
  try {
    const bolet = await Bolet.findByPk(req.params.boletId); // Cerca el bolet pel seu ID
    if (!bolet) {
      return res.status(404).json({ error: 'Bolet no trobat' }); // Retorna error 404 si el bolet no es troba
    }
    const tags = await bolet.getTags(); // Obté totes les etiquetes associades al bolet
    res.json(tags); // Retorna les etiquetes
  } catch (error) {
    res.status(500).json({ error: error.message }); // Retorna error 500 amb el missatge d'error
  }
});
*/

/*
// Endpoint per obtenir els bolets per a una etiqueta
router.get('/tags/:tagtId/bolets', async (req, res) => {
  try {
    const tag = await Tag.findByPk(req.params.tagId, { include: Bolet }); // Cerca l'etiqueta pel seu ID, incloent els bolets associats
    if (!tag) {
      return res.status(404).json({ error: 'Tag no trobat' }); // Retorna error 404 si l'etiqueta no es troba
    }
    res.json(tag.bolets); // Retorna els bolets associats a l'etiqueta
  } catch (error) {
    res.status(500).json({ error: error.message }); // Retorna error 500 amb el missatge d'error
  }
});
*/


module.exports = router;