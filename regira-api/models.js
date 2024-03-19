const Sequelize = require('sequelize');
const bcrypt = require('bcrypt');
const sequelize = new Sequelize('regira', 'root', 'admin', {
    host: 'localhost',
    port: 3308,
    dialect: 'mysql'
});

const User = sequelize.define('user', {
    name: {
      type: Sequelize.STRING,
      allowNull: false // No es permet valor nul per al nom
    },
    password: {
      type: Sequelize.STRING,
      allowNull: false // Es permet valor nul per a la descripció
    },
    email: {
      type: Sequelize.STRING, // Només es permeten aquests valors
      allowNull: false // No es permet valor nul per al tipus
    },
  }); 

const Project = sequelize.define('project', {
    name: {
      type: Sequelize.STRING,
      allowNull: false 
    },
    description: {
      type: Sequelize.STRING,
      allowNull: false 
    },
    active: {
      type: Sequelize.BOOLEAN,
        allowNull: true 
    },
  }); 

const Task = sequelize.define('task', {
    name: {
      type: Sequelize.STRING,
      allowNull: false
    },
    description: {
      type: Sequelize.STRING,
      allowNull: false
    },
    priority: {
      type: Sequelize.ENUM('high', 'medium', 'low'),
      allowNull: false
    },
    state: {
      type: Sequelize.ENUM('backlog', 'in_progress', 'review', 'done', 'closed'),
      allowNull: false,
      defaultValue: 'backlog'
    },
    task_type: {
      type: Sequelize.ENUM('story', 'bugs', 'general'),
      allowNull: false,
      },
  }); 

const Comment = sequelize.define('comment', {
    title: {
      type: Sequelize.STRING,
      allowNull: false
    },
    description: {
      type: Sequelize.STRING,
      allowNull: false
    },
  }); 



async function iniDB() {
    await sequelize.sync({ force: true });
}
  
  //iniDB();


// hook per encriptar la contrasenya abans de desar un nou usuari
User.beforeCreate(async (user) => {
    const hashedPassword = await bcrypt.hash(user.password, 10); // Encripta la contrasenya amb bcrypt
    user.password = hashedPassword;
  });

// Establir la relació entre els models

Project.hasMany(Task, {onDelete: 'CASCADE', hooks: true});
Task.belongsTo(Project);

User.hasMany(Task);
Task.belongsTo(User);

Task.hasMany(Comment, {onDelete: 'CASCADE', hooks: true});
Comment.belongsTo(Task);

User.hasMany(Comment);
Comment.belongsTo(User);

// Define el método createTask para crear una nueva tarea asociada al proyecto
Project.prototype.createTask = async function(taskData) {
  try {
    // Crea una nueva tarea asociada a este proyecto
    const task = await Task.create(taskData);
    // Asocia la nueva tarea al proyecto
    await this.addTask(task);
    return task;
  } catch (error) {
    throw new Error('No se pudo crear la tarea asociada al proyecto');
  }
};

// Exporta els models per a poder ser utilitzats en altres parts de l'aplicació
module.exports = {
    Project,
    User,
    Task,
    Comment
};





