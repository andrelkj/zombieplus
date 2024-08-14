const { expect } = require('@playwright/test');

export class Api {
  constructor(request) {
    this.request = request;
    this.token = undefined;
  }

  // define setToken function to send a post request with the given JSON payload
  async setToken() {
    const response = await this.request.post('http://localhost:3333/sessions', {
      data: {
        email: 'admin@zombieplus.com',
        password: 'pwd123',
      },
    });

    // expect for any 2.. response status code
    expect(response.ok()).toBeTruthy();

    // transform response into JSON and store token value into a variable
    const body = JSON.parse(await response.text());
    this.token = 'Bearer ' + body.token;
    console.log(this.token);
  }

  async postMovie(movie) {
    // set the token to authenticate the user
    await this.setToken();

    // setup headers information
    const response = await this.request.post('http://localhost:3333/movies', {
      headers: {
        Authorization: this.token,
        ContentType: 'multipart/form-data',
        Accept: 'application/json, text/plain, */*',
      },
      // fill the body payload
      multipart: {
        title: movie.title,
        overview: movie.overview,
        company_id: 'b7289a60-19a3-4d65-9ec4-8a852fe07695',
        release_year: movie.release_year,
        featured: movie.featured,
      },
    });

    expect(response.ok()).toBeTruthy();
  }
}
