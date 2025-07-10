<?php if (!isset($standalone)) {
    $standalone = false;
} ?>
<p align="justify">
    <?php if ($standalone) :?>
        <?php if (isset($saudacoes)):?>
            <?=isset($name) && $name ? $name . ',' : '{{name}}'?> <?=$saudacoes?>. <br><br>
        <?php endif ?>
        Nós da WIKI agradecemos essa oportunidade de sermos um dos seus fornecedores de serviços e nos colocamos a disposição para ajudar ou orientar em qualquer dúvida.<br><br>
    <?php endif ?>
A fim de melhorar a qualidade e utilização do serviço de backup, a WIKI busca por meio deste a divulgação de boas práticas com relação as rotinas diárias.<br> <?=isset($standalone) ? '<br>' : '' ?>
        Faz-se necessário o acompanhamento do backup pelo usuário/administrador para que sejam detectados quaisquer tipos de erros ou concorrências nos processos de backup. Caso seja detectado falha no processo de backup o usuário/administrador deverá comunicar à OPEN para resolução do problema de forma rápida, a fim de evitar que o usuário fique sem cópias de segurança dos seus dados. O acompanhamento das rotinas de backup poderá ser realizado através de relatórios diários de backup a serem encaminhados via email. Neste caso, solicito o email onde serão destinados os relatórios.<br> <?=isset($standalone) ? '<br>' : '' ?>
        Foi definido que seu ambiente executará diariamente a rotina de backup <?php if ($time):?> com início às <strong><?= $time?></strong> <?php else:?> entre <strong>18h às 05h</strong> <?php endif?> e retenção de <strong><?=$retention?> dias</strong>. Solicitamos por gentileza que verifiquem se o horário coincide com alguma rotina interna, e no caso de ocorrer tal conflito, nos informe para que possamos efetuar as devidas correções. <?=isset($standalone) ? '<br>' : '' ?>
    <?php if ($standalone) :?>
        <br><br>
        Caso tenha alguma dúvida, pode nos acionar diretamente.
        <br><br>Ficamos à disposição!
    <?php endif?>
</p>

<?php if ($standalone):?>
    <p>
        <br>
        Atenciosamente.<br><br>
        <strong><?= $_SESSION['user_name'] ?></strong><br>
        <?= $_SESSION['user_email'] ?>
        <br><br>
    </p>
<?php endif ?>
