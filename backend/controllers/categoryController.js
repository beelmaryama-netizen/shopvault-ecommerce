const db = require('../config/db');

exports.create = (req, res) => {
  db.query("INSERT INTO categories (name) VALUES (?)",
    [req.body.name],
    (err) => {
      if (err) return res.status(500).json(err);
      res.json("Catégorie créée");
    });
};

exports.getAll = (req, res) => {
  db.query("SELECT * FROM categories", (err, results) => {
    res.json(results);
  });
};

exports.update = (req, res) => {
  db.query(
    "UPDATE categories SET name=? WHERE id=?",
    [req.body.name, req.params.id],
    (err) => {
      if (err) return res.status(500).json(err);
      res.json("Catégorie modifiée");
    }
  );
};
exports.delete = (req, res) => {
  db.query(
    "DELETE FROM categories WHERE id=?",
    [req.params.id],
    (err) => {
      if (err) return res.status(500).json(err);
      res.json("Catégorie supprimée");
    }
  );
};
