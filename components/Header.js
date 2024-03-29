const headerTemplate = document.createElement('template');
headerTemplate.innerHTML = `
<style>
	/* forma dell'header */
	.logo {
		border-radius: 25%;
		height: 32px;
		width: 32px;
	}

	.span-linkutili {
		margin: 0;
		position: absolute;
		top: 50%;
		transform: translateY(-50%);
	}

	.header-span {
		padding-left: 16px;
	}

	.header-header {
		font-family: "Verdana";
		height: auto;
		position: relative;
		background-color: whitesmoke;
	}

/*********************************************************/

	/* Dropdown Button, liberamente preso da w3school, */
	.dropbtn {
		background-color: #4CAF50;
		color: white;
		padding: 16px;
		font-size: 16px;
		border: none;
	}

	/* The container <div> - needed to position the dropdown content */
	.dropdown {
		position: relative;
		display: inline-block;
		z-index: 2;
	}

	/* Dropdown Content (Hidden by Default) */
	.dropdown-content {
		display: none;
		position: absolute;
		background-color: #f1f1f1;
		min-width: 160px;
		box-shadow: 0px 8px 16px 0px rgba(0,0,0,0.2);
		z-index: 2;
	}

	/* Links inside the dropdown */
	.dropdown-content a {
		color: black;
		padding: 12px 16px;
		text-decoration: none;
		display: block;
		z-index: 2;
	}

	/* Change color of dropdown links on hover */
	.dropdown-content a:hover {background-color: #ddd;}

	/* Show the dropdown menu on hover */
	.dropdown:hover .dropdown-content {display: block;}

	/* Change the background color of the dropdown button when the dropdown content is shown */
	.dropdown:hover .dropbtn {background-color: #3e8e41;}


</style>
<header class="header-header">
	<img src="../../img/logo.png" class="logo"/>
	<span class="span-linkutili">
		<span class="dropdown">
			<span class="header-span"><a href="../index/index.html">HOME</a></span>
		</span>
		<span class="dropdown">
			<span class="header-span">CONTATTI</span>
			<div class="dropdown-content">
				<a href="https://www.linkedin.com/in/andrea-oggioni-6a4336204/">Linkedin</a>
				<a href="https://github.com/etabeta1">Github</a>
				<a href="mailto:andrea.oggioni03@gmail.com">Email</a>
			</div>
		</span>
		<span class="dropdown">
			<span class="header-span">GIOCHI JS</span>
			<div class="dropdown-content">

				<!--<a href="../snake/snake.html">Snake</a>-->
				<a href="../spacerace/spacerace.html">Space Race</a>
				<a href="../breakout/breakout.html">Breakout</a>
				<a href="../cubeShooter2.5D/cubeShooter2.5D.html">CubeShooter2.5D</a>
				<!--<a href="../galaga/galaga.html">Galaga</a>-->
				<a href="https://github.com/etabeta1/RemoteControlledSpaceInvadersClone">Space Invaders (no JS)</a>
			</div>
		</span>
		<span class="dropdown">
			<span class="header-span">GUIDE</span>
			<div class="dropdown-content">
				<a href="../ComandiConfigurazioneRouterSwitchCisco/index.html">Guida ai comandi per la configurazione di switch e router Cisco</a>
				<a href="../GuidaSPASS/index.html">Guida all'utilizzo di SPASS</a>
			</div>
		</span>
		<span class="header-span"><a href="../curriculum/curriculum.html">CHI SONO</a></span>
	</span>

</header>
`

class Header extends HTMLElement {
    constructor() {
        super();
    }

    connectedCallback() {
        const shadowRoot = this.attachShadow({ mode: 'open' });
        shadowRoot.appendChild(headerTemplate.content);
    }
}

customElements.define('header-component', Header);
