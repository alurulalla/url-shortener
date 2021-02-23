const fs = require('fs').promises;
const path = require('path');

const makeId = require('../utils/helpers');

const dataPath = path.join(__dirname, '..', 'data', 'urlShortenerData.json');

exports.getURLShorteners = async (req, res) => {
  try {
    const urls = JSON.parse(await fs.readFile(dataPath, 'utf-8'));

    res.status(200).json(urls.reverse());
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: 'Something went wrong!' });
  }
};

exports.createURLShortener = async (req, res) => {
  const { long_url } = req.body;
  // read data
  try {
    const urlsData = JSON.parse(await fs.readFile(dataPath, 'utf-8'));
    const id = makeId(9);
    const newURLData = { id, long_url };
    const data = [...urlsData, newURLData];

    await fs.writeFile(dataPath, JSON.stringify(data), 'utf-8');

    if (!long_url) return res.status(400).json({ error: 'Invalid Data' });
    return res.status(201).json(data);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: 'Something went wrong!' });
  }
};

exports.getUrlById = async (req, res) => {
  const { id } = req.params;
  try {
    const urlsData = JSON.parse(await fs.readFile(dataPath, 'utf-8'));
    const data = urlsData.filter((url) => url.id === id);
    if (data.length === 0)
      return res.status(404).json({ error: 'Requested ID is not available' });
    res.redirect(data[0].long_url);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: 'Something went wrong' });
  }
};

exports.deleteURL = async (req, res) => {
  const { id } = req.params;
  try {
    const urlsData = JSON.parse(await fs.readFile(dataPath, 'utf-8'));
    const data = urlsData.filter((url) => url.id === id);
    if (data.length === 0)
      return res.status(404).json({ error: 'Requested ID is not available' });
    const index = urlsData.indexOf(data[0]);
    urlsData.splice(index, 1);
    await fs.writeFile(dataPath, JSON.stringify(urlsData), 'utf-8');
    res.status(204).json({ success: 'Sucessfully deleted' });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: 'Something went wrong' });
  }
};
