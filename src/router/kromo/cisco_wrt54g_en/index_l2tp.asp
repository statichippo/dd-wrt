<div class="setting">
	<div class="label"><script type="text/javascript">Capture(share.usrname)</script></div>
	<input name="ppp_username" size="40" maxlength="63" onblur="valid_name(this,share.usrname)" value="<% nvram_get("ppp_username"); %>" />
</div>
<div class="setting">
	<div class="label"><script type="text/javascript">Capture(share.passwd)</script></div>
	<input name="ppp_passwd" size="40" maxlength="63" onblur="valid_name(this,share.passwd)" type="password" value="<% nvram_invmatch("ppp_passwd","","d6nw5v1x2pc7st9m"); %>" />&nbsp;&nbsp;&nbsp;
	<input type="checkbox" name="_ppp_passwd_unmask" value="0" onclick="setElementMask('ppp_passwd', this.checked)" >&nbsp;<script type="text/javascript">Capture(share.unmask)</script></input>
</div>
<div class="setting">
	<div class="label"><script type="text/javascript">Capture(idx_l.srv)</script></div>
	<input type="hidden" name="l2tp_server_ip" value="4"/>
	<input class="num" size="3" maxlength="3" name="l2tp_server_ip_0" onblur="valid_range(this,0,255,idx_l.srv)" value="<% get_single_ip("l2tp_server_ip","0"); %>" />.<input class="num" size="3" maxlength="3" name="l2tp_server_ip_1" onblur="valid_range(this,0,255,idx_l.srv)" value="<% get_single_ip("l2tp_server_ip","1"); %>" />.<input class="num" size="3" maxlength="3" name="l2tp_server_ip_2" onblur="valid_range(this,0,255,idx_l.srv)" value="<% get_single_ip("l2tp_server_ip","2"); %>" />.<input class="num" size="3" maxlength="3" name="l2tp_server_ip_3" onblur="valid_range(this,1,254,idx_l.srv)" value="<% get_single_ip("l2tp_server_ip","3"); %>" />
</div>
<div class="setting">
	<div class="label"><script type="text/javascript">Capture(idx_h.con_strgy)</script><br />&nbsp;</div>
	<input class="spaceradio" type="radio" name="ppp_demand" value="1" onclick="ppp_enable_disable(this.form,1)" <% nvram_checked("ppp_demand","1"); %> /><script type="text/javascript">Capture(idx_h.max_idle)</script>&nbsp;<input class="num" size="4" maxlength="4" name="ppp_idletime" onblur="valid_range(this,1,9999,idx_h.max_idle)" value="<% nvram_get("ppp_idletime"); %>" />&nbsp;<script type="text/javascript">Capture(share.mins)</script><br />
	<input class="spaceradio" type="radio" name="ppp_demand" value="0" onclick="ppp_enable_disable(this.form,0)" <% nvram_checked("ppp_demand","0"); %> /><script type="text/javascript">Capture(idx_h.alive)</script>&nbsp;<input class="num" size="4" maxlength="4" name="ppp_redialperiod" onblur="valid_range(this,20,180,idx_h.alive)" value="<% nvram_get("ppp_redialperiod"); %>" />&nbsp;<script type="text/javascript">Capture(share.secs)</script>
</div>