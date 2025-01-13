
import '@testing-library/jest-dom';
import{ fireEvent, render, screen } from "@testing-library/react";
import NavBar from "../NavBar";
import { BrowserRouter, useNavigate } from "react-router-dom";

const mockNavigate = jest.fn();
jest.mock('react-router',() => ({
    ...jest.requireActual('react-router'),
    useNavigate: () => mockNavigate
} ));

// Mock para o localStorage no teste de Logout
beforeEach(() => {
    jest.spyOn(Storage.prototype, 'removeItem');
});

afterEach(() => {
    jest.clearAllMocks();
});

describe("NavBar", () => {
    it("deveria renderizar a navbar", () =>{
        render(
        <BrowserRouter> 
            <NavBar/>
        </BrowserRouter>
       )

        //Procura pelo botao "Lista de Anúncios"
        const btListaAnuncios = screen.getByRole("link", {name: "Lista de Anúncios"});

        //Procura pelo botao "Cadastrar Anúncios"
        const btCadastrarAnuncios = screen.getByRole("link",{name: "Cadastrar Anúncio"});

        //Procura pelo botao "Meus Anúncios"
        const btMeusAnuncios = screen.getByRole("link",{name: "Meus Anúncios"});

        //Procura pelo botao "Uff Anuncia"
        const btUFFAnuncia = screen.getByRole("link",{name: "Uff Anuncia"});

        //Procura pelo botao "Logout"
        const btLogout = screen.getByRole("button",{name: "Logout"});

        expect(btListaAnuncios).toBeTruthy();
        expect(btCadastrarAnuncios).toBeTruthy();
        expect(btMeusAnuncios).toBeTruthy();
        expect(btUFFAnuncia).toBeTruthy();
        expect(btLogout).toBeTruthy();
    })
    //Testa a navegacao do botao lista de anuncios
    it("deveria ir para o lugar certo ao apertar esse botao lista de anuncios", () => {
        render(
            <BrowserRouter> 
                <NavBar/>
            </BrowserRouter>
           )
        const btListadeAnuncios = screen.getByRole("link", {name: "Lista de Anúncios"});
        fireEvent.click(btListadeAnuncios);

        // Verifica a navegação correta
        expect(mockNavigate).toHaveBeenCalledWith('/anuncios', expect.any(Object));
    });

     //Testa a navegacao do botao cadastrar anuncios
    it("deveria ir para o lugar certo ao apertar esse botao cadastrar anuncios", () => {
        render(
            <BrowserRouter> 
                <NavBar/>
            </BrowserRouter>
           )
        const btCadastrarAnuncio = screen.getByRole("link", {name:"Cadastrar Anúncio"});
        fireEvent.click(btCadastrarAnuncio);

        expect(mockNavigate).toHaveBeenCalledWith('/cadastrar', expect.any(Object));

    });

     //Testa a navegacao do botao meus anuncios
    it("deveria ir para o lugar certo ao apertar esse botao meus anuncios", () => {
        render(
            <BrowserRouter> 
                <NavBar/>
            </BrowserRouter>
           )
        const btMeusAnuncios = screen.getByRole("link", {name:"Meus Anúncios"});
        fireEvent.click(btMeusAnuncios);

        expect(mockNavigate).toHaveBeenCalledWith('/meus_anuncios', expect.any(Object));

    });
    //Testa a navegacao do botao Uff anuncia
    it("deveria ir para o lugar certo ao apertar esse botao Uff anuncia", () => {
        render(
            <BrowserRouter> 
                <NavBar/>
            </BrowserRouter>
           )
        const btUFFAnuncia = screen.getByRole("link", {name:"Uff Anuncia"});
        fireEvent.click(btUFFAnuncia);

        expect(btUFFAnuncia).toHaveAttribute('href', '/');

    });
    

     //Testa a navegacao do botao logout
    it("deveria navegar para '/' ao clicar no botão Logout", () => {
        const setIsAuthenticated = jest.fn(); // Mock para verificar se o estado foi chamado
        render(
            <BrowserRouter>
                <NavBar setIsAuthenticated={setIsAuthenticated} />
            </BrowserRouter>
        );

        const btLogout = screen.getByRole("button", { name: "Logout" });
        fireEvent.click(btLogout);

        // Verifica que o localStorage foi limpo e o estado foi alterado
        expect(localStorage.removeItem).toHaveBeenCalledWith('accessToken');
        expect(setIsAuthenticated).toHaveBeenCalledWith(false);

        // Verifica a navegação correta
        expect(mockNavigate).toHaveBeenCalledWith('/');
    });



          
})