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
  }

  async getCompanyIdByName(companyName) {
    // setup headers information
    const response = await this.request.get('http://localhost:3333/companies', {
      headers: {
        Authorization: this.token,
      },
      params: {
        name: companyName,
      },
    });

    expect(response.ok()).toBeTruthy();

    const body = JSON.parse(await response.text());
    return body.data[0].id;
  }

  async postMovie(movie) {
    const companyId = await this.getCompanyIdByName(movie.company);

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
        company_id: companyId,
        release_year: movie.release_year,
        featured: movie.featured,
      },
    });

    expect(response.ok()).toBeTruthy();
  }

  async postTvshow(tvshow) {
    const companyId = await this.getCompanyIdByName(tvshow.company);

    // setup headers information
    const response = await this.request.post('http://localhost:3333/tvshows', {
      headers: {
        Authorization: this.token,
        ContentType: 'multipart/form-data',
        Accept: 'application/json, text/plain, */*',
      },
      // fill the body payload
      multipart: {
        title: tvshow.title,
        overview: tvshow.overview,
        company_id: companyId,
        release_year: tvshow.release_year,
        seasons: tvshow.season,
        featured: tvshow.featured,
      },
    });

    expect(response.ok()).toBeTruthy();
  }
}
