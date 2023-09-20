const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const { google } = require('googleapis');
const multer = require('multer');
const path = require('path');
const { Readable } = require('stream');
const { Product, User, Request, Domain, Connection, Information } = require('./models');


require('dotenv').config();

const app = express();
app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// constant
const DB_URI = 'mongodb://localhost:27017/my_goods';
const PORT = 8003;

// define db
mongoose.connect(DB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log('Connected successfully to the MongoDB server');
  })
  .catch((err) => {
    console.error('Error connecting to MongoDB:', err);
  });

// define functions  

const getDriveService = () => {
  const KEY_FILE_PATH = path.join(__dirname, 'service.json');
  const SCOPES = ['https://www.googleapis.com/auth/drive'];

  const auth = new google.auth.GoogleAuth({
    keyFile: KEY_FILE_PATH,
    scopes: SCOPES,
  });
  const driveService = google.drive({ version: 'v3', auth });
  return driveService;
};

function bufferToStream(buffer) {
  const readable = new Readable();
  readable._read = () => {};
  readable.push(buffer);
  readable.push(null);
  return readable;
}

const uploadSingleFile = async (fileName, mimeType, fileBuffer) => {
  const drive = getDriveService();
  const folderId = '1dcUg7fk6TWAHpYlLm8iSFTMPpmdYl1ye';
  const { data } = await drive.files.create({
    resource: {
      name: fileName,
      parents: [folderId],
    },
    media: {
      mimeType,
      body: bufferToStream(fileBuffer),
    },
    fields: 'id,name,webContentLink',
  });
  await drive.permissions.create({
    fileId: data.id,
    requestBody: {
      role: 'reader',
      type: 'anyone',
    },
  });
  const response = await drive.files.get({
    fileId: data.id,
    fields: 'webContentLink',
  });
  return response.data;
};

//define entrypoint
app.post('/image_upload', 
  multer({storage: multer.memoryStorage()}).single('image'),
  async (req, res) => {
    try {
      const result = await uploadSingleFile(req.file.originalname, req.file.mimetype, req.file.buffer);
      res.json({path: result.webContentLink});
    } catch (e) {
        res.status(422).json({message: e.message});
    }
  }
);

app.post('/products', async (req, res) => {
    try {
      const {name, image, code, price} = req.body;
  
      const _product = new Product({name, image, code, price});
      await _product.save();
  
      res.json(_product);
    } catch (e) {
        res.status(422).json({message: e.message});
    }
});

app.put('/products/:id', async (req, res) => {
    try {
        const id = req.params.id;
        const {name, image, code, price} = req.body;
        const _product = await Product.findByIdAndUpdate(id, {name, image, code, price});
    
        res.json(_product);
    } catch (e) {
        res.status(422).json({message: e.message});
    }
});

app.delete('/products/:id', async (req, res) => {
    try {
        const id = req.params.id;
        await Product.findByIdAndDelete(id);
    
        res.json({});
    } catch (e) {
        res.status(422).json({message: e.message});
    }
});

app.get('/products', async (req, res) => {
    try {
      const products = await Product.find();
      res.json(products);
    } catch (e) {
        res.status(422).json({message: e.message});
    }
});

app.get('/products/:id', async (req, res) => {
    try {
        const id = req.params.id;
        const product = await Product.findById(id);
        res.json(product);
    } catch (e) {
        res.status(422).json({message: e.message});
    }
});

app.post('/users', async (req, res) => {
    try {
      const {userId, password, product, device} = req.body;
  
      const user = new User({userId, password, product, device});
      await user.save();
  
      res.json(user);
    } catch (e) {
      res.status(422).json({message: e.message});
    }
});

app.get('/users', async (req, res) => {
    try {
      const users = await User.find().populate('product');
      res.json(users);
    } catch (e) {
        res.status(422).json({message: e.message});
    }
});

app.get('/users/:id', async (req, res) => {
    try {
        const id = req.params.id;
        const user = await User.findById(id).populate('product');
        res.json(user);
    } catch (e) {
        res.status(422).json({message: e.message});
    }
});

app.delete('/users/:id', async (req, res) => {
    try {
        const id = req.params.id;
        await User.findByIdAndDelete(id);
        res.json({});
    } catch (e) {
        res.status(422).json({message: e.message});
    }
});


app.post('/requests', async (req, res) => {
    try {
      const {product, user } = req.body;
  
      const _request = new Request({product, user});
      await _request.save();
  
      res.json(_request);
    } catch (e) {
      res.status(422).json({message: e.message});
    }
});

app.get('/requests', async (req, res) => {
    try {
      const requests = await Request.find({userName: {$exists: true}, phone: {$exists: true}}).populate(['user','product']);
      res.json(requests);
    } catch (e) {
        res.status(422).json({message: e.message});
    }
});

app.get('/requests/:id', async (req, res) => {
    try {
        const id = req.params.id;
        const request = await Request.findById(id).populate(['user','product']);
        res.json(request);
    } catch (e) {
        res.status(422).json({message: e.message});
    }
});

app.put('/requests/:id', async (req, res) => {
    try {
        const id = req.params.id;
        const {shippingAddress, shippingMemo, phone, phone1, userName} = req.body;
        const _request = await Request.findByIdAndUpdate(id, {shippingAddress, shippingMemo, phone, phone1, userName});
    
        res.json(_request);
    } catch (e) {
        res.status(422).json({message: e.message});
    }
});

app.delete('/requests/:id', async (req, res) => {
    try {
        const id = req.params.id;
        await Request.findByIdAndDelete(id);
        res.json({});
    } catch (e) {
        res.status(422).json({message: e.message});
    }
});

app.post('/domains', async (req, res) => {
    try {
      const {value, status} = req.body;
  
      const domain = new Domain({value, status});
      await domain.save();
  
      res.json(domain);
    } catch (e) {
        res.status(422).json({message: e.message});
    }
});

app.get('/domains', async (req, res) => {
    try {
      const domains = await Domain.find();
      res.json(domains);
    } catch (e) {
        res.status(422).json({message: e.message});
    }
});

app.get('/domains/:id', async (req, res) => {
    try {
        const id = req.params.id;
        const domain = await Domain.findById(id);
        res.json(domain);
    } catch (e) {
        res.status(422).json({message: e.message});
    }
});

app.put('/domains/:id', async (req, res) => {
    try {
        const id = req.params.id;
        const {value, status} = req.body;
        const domain = await Domain.findByIdAndUpdate(id, {value, status});
    
        res.json(domain);
    } catch (e) {
        res.status(422).json({message: e.message});
    }
});
app.delete('/domains/:id', async (req, res) => {
    try {
        const id = req.params.id;
        await Domain.findByIdAndDelete(id);
        res.json({});
    } catch (e) {
        res.status(422).json({message: e.message});
    }
});

app.post('/connections', async (req, res) => {
    try {
      const {ip, page, device, product} = req.body;

      let connection;

      if (page === '메인') {
        connection = await Connection.findOne({ip, page, device, product}).sort({ updatedAt: -1 });
        if (connection) {
            return res.json(connection)
        }
      } else if (page === '주문서작성') {
        connection = await Connection.findOne({ip, page, device, product}).sort({ updatedAt: -1 });
        if (connection) {
            return res.json(connection);
        } else {
            connection = await Connection.findOne({ip, page: '메인', device, product}).sort({ updatedAt: -1 });
            if (connection) {
                return res.json(connection);
            }
        }
      } else if (page === '완료') {
        connection = await Connection.findOne({ip, page, device, product}).sort({ updatedAt: -1 });
        if (connection) {
            return res.json(connection);
        } else {
            connection = await Connection.findOne({ip, page: '주문서작성', device, product}).sort({ updatedAt: -1 });
            if (connection) {
                return res.json(connection);
            }
        }
      }
  
      connection = new Connection({ip, page, duration: 0, device, product});
      await connection.save();
  
      res.json(connection);
    } catch (e) {
        res.status(422).json({message: e.message});
    }
});

app.get('/connections', async (req, res) => {
    try {
      const connections = await Connection.find().populate('product');
      res.json(connections);
    } catch (e) {
        res.status(422).json({message: e.message});
    }
});

app.get('/connections/:id', async (req, res) => {
    try {
        const id = req.params.id;
        const connection = await Connection.findById(id).populate('product');
        res.json(connection);
    } catch (e) {
        res.status(422).json({message: e.message});
    }
});

app.put('/connections/:id', async (req, res) => {
    try {
        const id = req.params.id;
        const connection = await Connection.findByIdAndUpdate(id, req.body);
    
        res.json(connection);
    } catch (e) {
        res.status(422).json({message: e.message});
    }
});
app.delete('/connections/:id', async (req, res) => {
    try {
        const id = req.params.id;
        await Connection.findByIdAndDelete(id);
        res.json({});
    } catch (e) {
        res.status(422).json({message: e.message});
    }
});

app.get('/information', async (req, res) => {
    try {
        const information = await Information.findOne().populate('domain');
        res.json(information);
    } catch (e) {
        res.status(422).json({message: e.message});
    }
});

app.put('/information', async (req, res) => {
    try {
        const information = await Information.findOneAndUpdate({}, req.body);
        res.json(information);
    } catch (e) {
        res.status(422).json({message: e.message});
    }
});

app.post('/login', async (req, res) => {
    try {
      const {userId, password} = req.body;
  
      const information = await Information.findOne();
      if (!information) {
        throw new Error('아이디 비번이 정확하지 않습니다');
      }
      
      if (information.userId !== userId || information.password !== password) {
        throw new Error('아이디 비번이 정확하지 않습니다');
      }
  
      res.json({result: true});
    } catch (e) {
        console.log(JSON.stringify(e))
        res.status(422).json({message: e.message});
    }
});




// define server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
exports = module.exports = app;