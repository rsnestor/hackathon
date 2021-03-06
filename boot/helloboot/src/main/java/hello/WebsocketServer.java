package hello;

import java.io.IOException;
import java.util.ArrayList;
import java.util.Iterator;
import java.util.List;

import javax.websocket.OnClose;
import javax.websocket.OnError;
import javax.websocket.OnMessage;
import javax.websocket.OnOpen;
import javax.websocket.Session;
import javax.websocket.server.ServerEndpoint;

@ServerEndpoint("/websocketendpoint")
public class WebsocketServer {
	
	private static List<Session> userSessions = new ArrayList<Session>();
	
	@OnOpen
	public  void  onOpen(Session session){
		System.out.println("Open Connection ...");
		if(!userSessions.contains(session.getId()))
				userSessions.add(session);
	}
	
	@OnClose
	public  void onClose(Session session){
		System.out.println("Close Connection ...");
		for (Iterator<Session> i = userSessions.iterator(); i.hasNext();) {
		    Session element = i.next();
		    if (element.getId().equals(session.getId())) {
		        i.remove();
		    }
		}
		userSessions.remove(session);
	}
	
	@OnMessage
	public void onMessage(String message, Session session){
		System.out.println("Message from the client: " + message);
		
		broadcastMessage("Another user is interested in this property", session);
			
	}

	@OnError
	public void onError(Throwable e){
		e.printStackTrace();
	}

	public static  void broadcastMessage(String message, Session session) {
		 for (Session s : userSessions) {
		  if (s.isOpen() && s.getId() != session.getId()) {
		   try {
		    s.getBasicRemote().sendText(message);
		    System.out.println("done with broadcast");	
		   } catch (IOException e) {
		    e.printStackTrace();
		   }
		  }
		 }
		}
}