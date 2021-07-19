import React from "react";
import nookies from "nookies";
import jwt from "jsonwebtoken";
import MainGrid from "../src/components/MainGrid";
import Box from "../src/components/Box";

import { ProfileRelationsBoxWrapper } from "../src/components/ProfileRelations";

import {
  AlurakutMenu,
  AlurakutProfileSidebarMenuDefault,
  OrkutNostalgicIconSet,
} from "../src/lib/AlurakutCommons";

function ProfileSidebar(props) {
  return (
    <Box as="aside">
      <img
        src={`https://github.com/${props.githubUser}.png`}
        style={{
          borderRadius: "8px",
        }}
      ></img>
      <hr />
      <p>
        <a className="boxLink" href={`https://github.com/${props.githubUser}`}>
          @{props.githubUser}
        </a>
      </p>
      <hr />
      <AlurakutProfileSidebarMenuDefault />
    </Box>
  );
}

function ProfileRelationsBox(props) {
  return (
    <ProfileRelationsBoxWrapper>
      <h2 className="smallTitle">
        {props.title} ({props.items.length})
      </h2>
      <ul>
        {props.items.map((itemAtual) => {
          return (
            <li key={itemAtual.id}>
              <a href={`./users/${itemAtual.id}`}>
                <img src={itemAtual.imageUrl} />
                <span>{itemAtual.title}</span>
              </a>
            </li>
          );
        })}
      </ul>
    </ProfileRelationsBoxWrapper>
  );
}

export default function Home(props) {
  const [comunidades, setComunidades] = React.useState([]);
  const githubUser = props.githubUser;
  const pessoasFavoritas = [
    "juunegreiros",
    "peas",
    "omariosouto",
    "rafaballerini",
    "marcobrunodev",
    "filipefialho",
  ];
  // API Github
  const [seguidores, setSeguidores] = React.useState([]);
  React.useEffect(() => {
    fetch("https://api.github.com/users/peas/followers")
      .then((respostaDoServidor) => {
        return respostaDoServidor.json();
      })
      .then((respostaCompleta) => {
        setSeguidores(respostaCompleta);
      });
    // API GraphQL
    fetch("https://graphql.datocms.com", {
      method: "POST",
      headers: {
        Authorization: "4f772c27dc8abfe3b6b3b90dc1d8c7",
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        query: `query {
        allCommunities{
          title
          id
          imageUrl
          creatorSlug
          
        }
      }`,
      }),
    })
      .then((respostaDoServidor) => {
        return respostaDoServidor.json();
      })
      .then((respostaCompleta) => {
        let comunidades = respostaCompleta.data.allCommunities;
        setComunidades(comunidades);
      });
  }, []);
  return (
    <>
      <AlurakutMenu githubUser={githubUser} />
      <MainGrid>
        <div
          className="profileArea"
          style={{
            gridArea: "profileArea",
          }}
        >
          <ProfileSidebar githubUser={githubUser} />
        </div>

        <div
          className="welcomeArea"
          style={{
            gridArea: "welcomeArea",
          }}
        >
          <Box>
            <h1 className="title">Bem Vindo(a)</h1>
            <OrkutNostalgicIconSet confiavel="3" legal="3" sexy="1" />
          </Box>

          <Box>
            <h2 className="subTitle">O que você deseja fazer</h2>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                const dadosDoForm = new FormData(e.target);

                const comunidade = {
                  title: dadosDoForm.get("title"),
                  imageUrl: dadosDoForm.get("image"),
                  creatorSlug: githubUser,
                };

                fetch("/api/comunidades", {
                  method: "POST",
                  headers: {
                    "Content-Type": "application/json",
                  },
                  body: JSON.stringify(comunidade),
                }).then(async (response) => {
                  const comunidadesAtualizadas = [...comunidades, comunidade];
                  setComunidades(comunidadesAtualizadas);
                });
              }}
            >
              <div>
                <input
                  placeholder="Qual vai ser o nome da sua comunidade"
                  name="title"
                  aria-label="Qual vai ser o nome da sua comunidade"
                  type="text"
                />
              </div>

              <div>
                <input
                  placeholder="Coloque uma url para usarmos de capa"
                  name="image"
                  aria-label="Qual vai ser o nome da sua comunidade"
                />
              </div>
              <button>Criar Comunidade</button>
            </form>
          </Box>
        </div>

        <div
          className="profileRelationsArea"
          style={{
            gridArea: "profileRelationsArea",
          }}
        >
          <ProfileRelationsBox items={seguidores} title="Seguidores" />
          <ProfileRelationsBox items={comunidades} title="Comunidades" />
          <ProfileRelationsBoxWrapper>
            <h2 className="smallTitle">
              Pessoas da Comunidade ({pessoasFavoritas.length})
            </h2>
            <ul>
              {pessoasFavoritas.map((itemAtual) => {
                return (
                  <li key={itemAtual}>
                    <a href={`./users/${itemAtual}`}>
                      <img src={`https://github.com/${itemAtual}.png`} />
                      <span>{itemAtual}</span>
                    </a>
                  </li>
                );
              })}
            </ul>
          </ProfileRelationsBoxWrapper>
        </div>
      </MainGrid>
    </>
  );
}
export async function getServerSideProps(context) {
  const cookies = nookies.get(context);
  const token = cookies.USER_TOKEN;
  const { githubUser } = jwt.decode(token);
  const { isAuthenticated } = await fetch("http://localhost:3000/api/auth", {
    headers: {
      Authorization: token,
    },
  }).then((res) => res.json());

  console.log("IsAuthenticated", isAuthenticated);

  if (!isAuthenticated) {
    return {
      redirect: {
        destination: "/login",
        permanent: false,
      },
    };
  }
  return {
    props: {
      githubUser,
    }, // will be passed to the page component as props
  };
}
