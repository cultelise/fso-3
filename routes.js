const fs = require('fs')

const requestHandler = (req, res) => {
  const url = req.url
  const method = req.method
  if (url === '/') {
    res.setHeader('Content-Type', 'text/html');
    res.write('<html><body>');
    res.write('<h1>Hey, Elise</h1>');
    res.write('<form action="/message" method="POST"><input type="text" name="message"><button type="submit">submit</button></form>');
    res.write('</body></html>');
    return res.end();
  }
  if (url === '/message' && method === 'POST') {
    const body = [];
    req.on('data', (chunk) => {
      console.log(chunk)
      body.push(chunk)
    });
    return req.on('end', () => {
      const parsedBody = Buffer.concat(body).toString();
      const message = parsedBody.split('=')[1]
      fs.writeFile('message.text', message, (error) => {   
        res.writeHead(302, {Location: '/'});
        return res.end();
      });
    });
  }
  res.setHeader('Content-Type', 'text/html');
  res.write('<html>');
  res.write('<h1>Hello, Elise</h1>');
  res.write('</html>');
  res.end();

};

exports = requestHandler