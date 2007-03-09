/*
 * stabridge.c
 *
 * Copyright (C) 2006 Sebastian Gottschall <gottschall@dd-wrt.com>
 *
 * This program is free software; you can redistribute it and/or
 * modify it under the terms of the GNU General Public License
 * as published by the Free Software Foundation; either version 2
 * of the License, or (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program; if not, write to the Free Software
 * Foundation, Inc., 59 Temple Place - Suite 330, Boston, MA  02111-1307, USA.
 *
 * $Id:
 */

#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <signal.h>
#include <net/route.h>
#include <sys/socket.h>
#include <netinet/in.h>
#include <arpa/inet.h>
#include <errno.h>
#include <time.h>
#include <unistd.h>
#include <sys/sysinfo.h>

#include <bcmnvram.h>
#include <netconf.h>
#include <shutils.h>
#include <rc.h>
#include <code_pattern.h>
#include <cy_conf.h>
#include <utils.h>


static void
filterarp (char *ifname)
{
//        ebtables     -t    broute -A BROUTING -p ARP -i <first ethernet interface> --arp-mac-dst ! <bridge MAC address> --arp-ip-dst ! <bridge IP address> -j DROP

  eval ("ebtables", "-t", "broute", "-A", "BROUTING", "-p", "ARP", "-i",
	ifname, "--arp-mac-dst", "!", nvram_safe_get ("lan_hwaddr"),
	"--arp-ip-dst", "!", nvram_safe_get ("lan_ipaddr"), "-j", "DROP");
}

void
start_stabridge (void)
{

#ifdef HAVE_MADWIFI
  if (getWET ())
#else
  if (nvram_match ("wl0_mode", "wet"))
#endif
    {
      eval ("insmod", "ebtables");
      eval ("insmod", "ebtable_nat");
      eval ("insmod", "ebtable_broute");
      eval ("insmod", "ebtable_filter");
      eval ("insmod", "ebt_snat");
      eval ("insmod", "ebt_arp");
      eval ("insmod", "ebt_arpreply");
/* ...
   4. create Wireless Client Bridge service dependency on EBTABLES for each ethernet device:
	* ebtables -t broute -A BROUTING -p ARP -i <first ethernet interface> --arp-mac-dst ! <bridge MAC address> --arp-ip-dst ! <bridge IP address> -j DROP
	* ...
	* ebtables -t broute -A BROUTING -p ARP -i <last ethernet interface> --arp-mac-dst ! <bridge MAC address> --arp-ip-dst ! <bridge IP address> -j DROP
	* ebtables -t nat -A POSTROUTING -o <wireless interface> -j snat --to-src <wireless MAC address> --snat-target ACCEPT
   5. run Wireless Client bridge daemon:
	* stabridge -d -w <wireless interface> -b <bridge interface> -e <first ethernet interface> ... <last ethernet interface>
*/

#ifdef HAVE_MAGICBOX
      filterarp ("eth0");
      filterarp ("eth1");
      filterarp ("eth2");
#elif HAVE_FONERA
      filterarp ("eth0");
#elif HAVE_WHRAG108
      filterarp ("eth0");
      filterarp ("eth1");
#elif HAVE_X86
      filterarp ("eth0");
      filterarp ("eth1");
      filterarp ("eth2");
      filterarp ("eth3");
      filterarp ("eth4");
      filterarp ("eth5");
      filterarp ("eth6");
      filterarp ("eth7");
      filterarp ("eth8");
      filterarp ("eth9");
      filterarp ("eth10");
#elif HAVE_GATEWORX
      filterarp ("ixp0");
      filterarp ("ixp1");
#elif HAVE_RB500
      filterarp ("eth0");
      filterarp ("eth1");
      filterarp ("eth2");
#else //Broadcom
      char firstlanif[16];
      sscanf (nvram_safe_get ("lan_ifnames"), "%s ", firstlanif);

      filterarp (firstlanif);
#endif
      eval ("brctl", "stp", nvram_safe_get ("lan_ifname"), "off");
      char hwaddr[16];
      sprintf (hwaddr, "%s_hwaddr", getWET ());
      eval ("ebtables", "-t", "nat", "-A", "POSTROUTING", "-o", getWET (),
	    "-j", "snat", "--to-src", nvram_safe_get (hwaddr),
	    "--snat-target", "ACCEPT");

/*		"\t-s <size>\t- Use MAC DB size. Default is %d if no in configuration found\n"
		"\t-w <devname>\t- Use wireless device name. Default is ath0 if no in configuration found\n"
		"\t-b <devname>\t- Use bridge device name. Default is br0 if no in configuration found\n"
		"\t-e <devname(s)>\t- Use ethernet device(s) name(s) separated by space. Default is eth0 if no in configuration found\n",
*/
#ifdef HAVE_MAGICBOX
      eval ("stabridge", "-d", "-w", getWET (), "-b", "br0", "-e", "eth0",
	    "eth1", "eth2");
#elif HAVE_FONERA
      eval ("stabridge", "-d", "-w", "ath0", "-b", "br0", "-e", "eth0");
#elif HAVE_WHRAG108
      eval ("stabridge", "-d", "-w", getWET (), "-b", "br0", "-e", "eth0",
	    "eth1");
#elif HAVE_GATEWORX
      eval ("stabridge", "-d", "-w", getWET (), "-b", "br0", "-e", "ixp0",
	    "ixp1");
#elif HAVE_RB500
      eval ("stabridge", "-d", "-w", getWET (), "-b", "br0", "-e", "eth0",
	    "eth1", "eth2");
#elif HAVE_X86
      char commandline[256];
      sprintf (commandline, "stabridge -d -w %s -b br0 -e", getWET ());
      int i;
      static char word[256];
      char *next, *wordlist;
      wordlist = nvram_safe_get ("lan_ifnames");
      foreach (word, wordlist, next)
      {
	if (strncmp (word, "ath", 3))
	  {
	    if (ifexists (word))
	      sprintf (commandline, "%s %s", commandline, word);
	  }
      }
      system (commandline);
#else //Broadcom
      eval ("stabridge", "-d", "-w", nvram_safe_get ("wl0_ifname"), "-b",
	    "br0", "-e", firstlanif);
#endif

    }
}


void
stop_stabridge (void)
{
#ifdef HAVE_MADWIFI
  if (getWET ())
#else
  if (nvram_match ("wl0_mode", "wet"))
#endif
    {
      killall ("stabridge", SIGTERM);
      eval ("rmmod", "ebt_arpreply");
      eval ("rmmod", "ebt_arp");
      eval ("rmmod", "ebt_snat");
      eval ("rmmod", "ebtable_filter");
      eval ("rmmod", "ebtable_broute");
      eval ("rmmod", "ebtable_nat");
      eval ("rmmod", "ebtables");
    }

}
