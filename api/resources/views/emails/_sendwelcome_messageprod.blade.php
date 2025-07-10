<p>{{ ucwords(strtok($customer->cm_name, ' ')) }}, {{ $saudacoes }}.</p>

<p>Sou analista da WIKI e venho informar que a sua solicitação já está disponível para uso.</p>

<div align="center">
    <table border="1" cellspacing="0" cellpadding="4" style="margin: 0 auto; margin-bottom: 20px; min-width: 540px">
        <thead style="background-color: #b32020; color: #fff;">
            <tr>
                <th>Dados do pedido</th>
            </tr>
        </thead>
        <tbody>
            <tr style="background-color: #fbfbfb;padding:10px">
                <td>
    [[CN]] ### Não apague esta linha ###
                </td>
            </tr>
        </tbody>
    </table>
</div>

<p></p>

<div align="center">
    <table border="1" cellspacing="0" cellpadding="4" style="margin: 0 auto; margin-bottom: 20px; min-width: 540px">
        <thead style="background-color: #b32020; color: #fff;padding:10px">
            <tr>
                <th>Dados de acessos</th>
            </tr>
        </thead>
        <tbody>
            <tr style="background-color: #fbfbfb">
                <td>
    [[LOGININIT]] ### Não apague esta linha ###<br>
    [[LOGIN]] ### Não apague esta linha ###<br>
    [[LOGINEND]] ### Não apague esta linha ###<br>
                </td>
            </tr>
        </tbody>
    </table>
</div>

<p></p>

<div align="center">
    <table border="1" cellspacing="0" cellpadding="4" style="margin: 0 auto; margin-bottom: 20px; min-width: 540px">
        <thead style="background-color: #b32020; color: #fff;">
            <tr>
                <th>Sistemas de chamados e painel</th>
            </tr>
        </thead>
        <tbody>
            <tr style="background-color: #fbfbfb;padding:10px">
                <td>
                    <p>
                        <a href="https://painel.wiki.com.br">Painel</a><br>
                        URL: painel.wiki.com.br
                    </p>
                    <p>
    [[PAINELPRIMEIROACESSO]] ### Não apague esta linha ###
                    </p>
                    <p>
                        O Painel é nosso sistema de chamados para atendimento de novas demandas,<br>solicitações de configuração, apoio em incidentes entre outros.
                    </p>
                </td>
            </tr>
        </tbody>
    </table>
</div>

<p></p>

<p>
    Desejamos sucesso nessa nova parceria e ficamos a disposição para ajudar no que for necessário para contribuir com o crescimento dos seus negócios.
</p>

<p>
Segue meus contatos em minha assinatura eletrônica.
</p>

<p>
    <br>
    Atenciosamente.<br><br>
    <strong>{{ $_SESSION['user_name'] }}</strong><br>
    {{ $_SESSION['user_email'] }}
    <br><br>
</p>
<img src="https://services.wiki.example/assets/img/signatures/{{ preg_replace('/@.*/', '', $_SESSION['user_email']) }}.png" alt="{{ $_SESSION['user_name'] }}">
