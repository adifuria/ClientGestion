var express = require('express');
var router = express.Router();
var connection  = require('../lib/db');
 
 
/* GET home page. */
router.get('/', function(req, res, next) {
      
 connection.query('SELECT * FROM client ORDER BY id_client desc',function(err,rows)     {
 
        if(err){
         req.flash('error', err); 
         res.render('customers',{page_title:"Customers - Node.js",data:''});   
        }else{
            
            res.render('customers',{page_title:"Customers - Node.js",data:rows});
        }
                            
         });
        
    });
 
 
// SHOW ADD USER FORM
router.get('/add', function(req, res, next){    
    // render to views/user/add.ejs
    res.render('customers/add', {
        title: 'Add New Customers',
        name: '',
        surname: '',
        email: '',
        cp: '',
        address: '',
        city: '',
        country: ''
                
    })
})
 
// ADD NEW USER POST ACTION
router.post('/add', function(req, res, next){    
    req.assert('name', 'Name is required').notEmpty()           //Validate name
    req.assert('surname', 'Surname is required').notEmpty()  //Validate email
    req.assert('email', 'Email is required').notEmpty()           //Validate name
    req.assert('cp', 'CP is required').notEmpty()  //Validate email
    req.assert('address', 'Address is required').notEmpty()           //Validate name
    req.assert('city', 'City is required').notEmpty()  //Validate email
    req.assert('country', 'Country is required').notEmpty()  //Validate email
  
    var errors = req.validationErrors()
     
    if( !errors ) {   //No errors were found.  Passed Validation!
         
     
        var user = {
            nom_client: req.sanitize('name').escape().trim(),
            prenom_client: req.sanitize('surname').escape().trim(),
            mail_client: req.sanitize('email').escape().trim(),
            CP_client: req.sanitize('cp').escape().trim(),
            adresse_client: req.sanitize('address').escape().trim(),
            ville_client: req.sanitize('city').escape().trim(),
            pays_client: req.sanitize('country').escape().trim()
        }
         
     connection.query('INSERT INTO client SET ?', user, function(err, result) {
                //if(err) throw err
                if (err) {
                    req.flash('error', err)
                     
                    // render to views/user/add.ejs
                    res.render('customers/add', {
                        title: 'Add New Customer',
                        name: user.name,
                        surname: user.surname,
                        email: user.email,
                        cp: user.cp,
                        address: user.address,
                        city: user.city,
                        country: user.country
                                            
                    })
                } else {                
                    req.flash('success', 'Data added successfully!');
                    res.redirect('/customers');
                }
            })
    }
    else {   //Display errors to user
        var error_msg = ''
        errors.forEach(function(error) {
            error_msg += error.msg + '<br>'
        })                
        req.flash('error', error_msg)        
         
        /**
         * Using req.body.name 
         * because req.param('name') is deprecated
         */ 
        res.render('customers/add', { 
            title: 'Add New Customer',
            name: req.body.name,
            surname: req.body.surname,
            email: req.body.email,
            cp: req.body.cp,
            address: req.body.address,
            city: req.body.city,
            country: req.body.country
        })
    }
})
// SHOW EDIT USER FORM
router.get('/edit/(:id)', function(req, res, next){
   
    connection.query('SELECT * FROM client WHERE id_client = ' + req.params.id, function(err, rows, fields) {
                if(err) throw err
                 
                // if user not found
                if (rows.length <= 0) {
                    req.flash('error', 'Customers not found with id = ' + req.params.id)
                    res.redirect('/customers')
                }
                else { // if user found
                    // render to views/user/edit.ejs template file
                    res.render('customers/edit', {
                        title: 'Edit Customer', 
                        //data: rows[0],
                        id: rows[0].id_client,
                        name: rows[0].nom_client,
                        surname: rows[0].prenom_client,
                        email: rows[0].mail_client,
                        cp: rows[0].CP_client,
                        address: rows[0].adresse_client,
                        city: rows[0].ville_client, 
                        country: rows[0].pays_client                   
                    })
                }            
            })
      
    })
 
// EDIT USER POST ACTION
router.post('/update/:id', function(req, res, next) {
    req.assert('name', 'Name is required').notEmpty()           //Validate name
    req.assert('surname', 'Surname is required').notEmpty()  //Validate email
    req.assert('email', 'Email is required').notEmpty()           //Validate name
    req.assert('cp', 'CP is required').notEmpty()  //Validate email
    req.assert('address', 'Address is required').notEmpty()           //Validate name
    req.assert('city', 'City is required').notEmpty()  //Validate email
    req.assert('country', 'Country is required').notEmpty()  //Validate email
  
    var errors = req.validationErrors()
     
    if( !errors ) {   
 
        var user = {
            nom_client: req.sanitize('name').escape().trim(),
            prenom_client: req.sanitize('surname').escape().trim(),
            mail_client: req.sanitize('email').escape().trim(),
            CP_client: req.sanitize('cp').escape().trim(),
            adresse_client: req.sanitize('address').escape().trim(),
            ville_client: req.sanitize('city').escape().trim(),
            pays_client: req.sanitize('country').escape().trim()
        }
         
connection.query('UPDATE client SET ? WHERE id_client = ' + req.params.id, user, function(err, result) {
                //if(err) throw err
                if (err) {
                    req.flash('error', err)
                     
                    // render to views/user/add.ejs
                    res.render('customers/edit', {
                        title: 'Edit Customer',
                        id: req.params.id,
                        name: req.body.name,
                        surname: req.body.surname,
                        email: req.body.email,
                        cp: req.body.cp,
                        address: req.body.address,
                        city: req.body.city,
                        country: req.body.country
                    })
                } else {
                    req.flash('success', 'Data updated successfully!');
                    res.redirect('/customers');
                }
            })
         
    }
    else {   //Display errors to user
        var error_msg = ''
        errors.forEach(function(error) {
            error_msg += error.msg + '<br>'
        })
        req.flash('error', error_msg)
         
        /**
         * Using req.body.name 
         * because req.param('name') is deprecated
         */ 
        res.render('customers/edit', { 
            title: 'Edit Customer',            
            id: req.params.id, 
            name: req.body.name,
            surname: req.body.surname,
            email: req.body.email,
            cp: req.body.cp,
            address: req.body.address,
            city: req.body.city,
            country: req.body.country
        })
    }
})
    // DELETE USER
    router.get('/delete/(:id)', function(req, res, next) {
        var user = { id: req.params.id }
         
    connection.query('DELETE FROM client WHERE id_client = ' + req.params.id, user, function(err, result) {
                //if(err) throw err
                if (err) {
                    req.flash('error', err)
                    // redirect to users list page
                    res.redirect('/customers')
                } else {
                    req.flash('success', 'Customer deleted successfully! id = ' + req.params.id)
                    // redirect to users list page
                    res.redirect('/customers')
                }
            })
       })
     
     
module.exports = router;