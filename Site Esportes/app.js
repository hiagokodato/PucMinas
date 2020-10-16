const API_KEY = 'b353ac98060e4a529df83727669d6c2d';

function exibeNoticias () {
    let divTela = document.getElementById('tela');
    let texto = '';

 
    let dados = JSON.parse (this.responseText);
    for (i=0; i< dados.articles.length; i++) {
        let noticia = dados.articles[i];
        let data = new Date (noticia.publishedAt);

        texto = texto + `
        <div class="row">
        <div class="col-lg-4 col-md-12 col-sm-12 portfolio-item">
          <div class="card h-100">
          <img src="${noticia.urlToImage}" alt="">
            <div class="card-body">
              <h4 class="card-title">
              <span class="titulo">${noticia.title}</span>
              <span class="text"><br>
              ${noticia.content}
                  <a href="#">${noticia.url}</a>
              </span>
              </div>
            </div>
        `;
    };

    divTela.innerHTML = texto;
}

function executaPesquisa () {
    let query = document.getElementById('txtPesquisa').value;

    let xhr = new XMLHttpRequest ();
    xhr.onload = exibeNoticias;
    xhr.open ('GET', `https://newsapi.org/v2/everything?q=${query}&apiKey=${API_KEY}`);
    xhr.send ();
}

document.getElementById ('btnPesquisa').addEventListener ('click', executaPesquisa);


