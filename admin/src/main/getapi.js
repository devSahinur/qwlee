

axios.get('http://103.145.138.54:7171/v1/categories')
  .then(response => {
    console.log(response.data);
  })
  .catch(error => {
    console.error('Error fetching data: ', error);
  });
