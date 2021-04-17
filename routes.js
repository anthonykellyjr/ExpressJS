const express = require('express');
const router = express.Router();
const asyncHandler = require('./asyncHandler');
const records = require('./records');

//send a GET request to /quotes READ a LIST of quotes
router.get('/quotes', async(req, res) => {
    try {
        const quotes = await records.getQuotes();
        res.json(quotes);
    } catch(error) {
        res.json({message: error.message});
    }
  });
  
//send a GET request to /quotes:id READ a quote
router.get('/quotes/:id', asyncHandler(async(req, res) => {
    const { id } = req.params;
    const quote = await records.getQuote(id);
    if(quote) {
    res.json(quote);
    } else {
    res.status(404).json({message: "Quote not found"});
    }
}));
  
//send a GET request to /quotes:id READ a quote
router.get('/quotes/quote/random', asyncHandler(async(req, res) => {
    const quote = await records.getRandomQuote();
    res.json(quote.quote);
}));

  
  
  router.post('/quotes', asyncHandler(async(req, res) => {
    if(req.body.quote && req.body.author) {
      const quote = await records.createQuote({
        quote: req.body.quote,
        author: req.body.author
      });
      res.status(201).json(quote);
    } else {
      res.status(400).json("Request must include author and quote parameters");
    }
  }));
  
  //send a PUT request to /quotes:id UPDATE (edit) a quote
  router.put('/quotes:id', asyncHandler(async(req, res) => {
      const quote = await records.getQuote(req.params.id);
      if(quote) {
        quote.quote = req.body.quote;
        quote.author = req.body.author;
        await records.updateQuote(quote);
        res.status(204).end();
      }
      else {
        res.status(404).json({message:'Quote not found'});
      }
  }));
  
  //send a DELETE request to /quotes/:id DELETE a quote
  router.delete('/quotes/:id', asyncHandler(async(req, res) => {
      //throw new Error('Something terrible has hrouterened. May god have mercy on our wretched souls');
      const { id } = req.params;
      const quote = await records.getQuote(id);
      await records.deleteQuote(quote);
      res.status(204).end();
  }))
  
  //send a GET request to quotes/quote/random READ (view) a random quote
  router.get('/greetings', (req, res) => {
    res.json({greeting: "Hello World!"});
  });

module.exports = router;