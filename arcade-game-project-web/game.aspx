<%@ Page Title="" Language="C#" MasterPageFile="~/MasterPage.master" AutoEventWireup="true" CodeFile="game.aspx.cs" Inherits="game" %>

<asp:Content ID="Content1" ContentPlaceHolderID="head" Runat="Server">

</asp:Content>
<asp:Content ID="Content2" ContentPlaceHolderID="ContentPlaceHolder1" Runat="Server">
     <canvas id="gameCanvas">
        Please upgrade your browser to support HTML5.
        One recommendation is to install the latest Chrome or Firefox.
    </canvas>
    <script src="constants.js"></script>
    <script type="text/javascript" src="game.js"></script>
</asp:Content>

