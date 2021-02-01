const { authenticationToken } = require('./common')
const express = require('express')
const {TagsDao, WordSetsDao} = require("../database/dao");
const router = express.Router()

// Get all tags
router.get("/tags", authenticationToken, (req, res) => {
    let data = req.body;
    let tags = TagsDao.getAll();
    res.json({
        "tags": tags
    })
})

// Get all sets from tags
router.get("/sets", authenticationToken, (req, res) => {
    let data = req.body;
    let sets = WordSetsDao.getAllFromTags(data.tags, 30);
    res.json({
        "sets": sets
    })
})

// Get all words from set
router.get("/sets/words", authenticationToken, (req, res) => {
    let data = req.body;
    let words = WordSetsDao.getWords(data.setId);
    res.json({
        "set": data.setId,
        "words": words
    })
})

// insert new sets
router.post("/sets", authenticationToken, (req, res) => {
    let data = req.body;
    //TODO Checks tags and words and name
    WordSetsDao.insert(data.name, data.creator, data.tags, data.words);
    res.status(200).send('Added set with name:' + data.name);
    res.status(401).send('Incorrect set');
})

// delete set
router.delete('/sets', authenticationToken, (req, res) => {
    let data = req.body;
    //TODO Checks tags and words and name
    //if (data.creator)
    // match authenticationToken with sets creator
    {
        WordSetsDao.delete(data.name);
        res.status(200).send('Delete set with name:' + data.name);
        res.status(401).send('Incorrect set');
        res.status(401).send('Incorrect user');
    }
})
