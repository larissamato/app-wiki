<p>{{ ucwords(strtok($customer->cm_name, ' ')) }}, {{ $saudacoes }}.</p>

<p>Nós da WIKI agradecemos essa oportunidade de sermos um dos seus fornecedores de serviços e nos colocamos a disposição para ajudar ou orientar em qualquer dúvida neste período de avaliação.</p>
 
<p>Abaixo segue os acessos do seu ambiente solicitado</p>

<div align="center">
    <table border="1" cellspacing="0" cellpadding="4" style="margin: 0 auto; margin-bottom: 20px; min-width: 540px">
        <thead style="background-color: #b32020; color: #fff;">
            <tr>
                <th>Dados de acessos</th>
            </tr>
        </thead>
        <tbody>
            <tr style="background-color: #fbfbfb;padding:10px">
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

<p>Caso tenha alguma dúvida, pode nos acionar diretamente.</p>

<p>Ficamos à disposição.</p>
 
<p>
    <em>Atenciosamente.</em>
</p>

<img src="https://services.wiki.example/assets/img/signatures/{{ preg_replace('/@.*/', '', $_SESSION['user_email']) }}.png" alt="{{ $_SESSION['user_name'] }}">
